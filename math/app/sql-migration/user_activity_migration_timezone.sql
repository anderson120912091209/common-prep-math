-- User Activity Tracking Table with Timezone Support
-- This table tracks daily problem-solving activity for contribution graphs

CREATE TABLE user_activity (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    problems_solved INTEGER DEFAULT 0,
    activity_level INTEGER DEFAULT 0, -- 0-4 intensity level for contribution graph
    timezone TEXT DEFAULT 'UTC', -- Store user's timezone
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure one record per user per date
CREATE UNIQUE INDEX user_activity_user_date_idx ON user_activity(user_id, date);

-- Index for efficient queries
CREATE INDEX user_activity_user_id_idx ON user_activity(user_id);
CREATE INDEX user_activity_date_idx ON user_activity(date);

-- Function to calculate activity level based on problems solved
CREATE OR REPLACE FUNCTION calculate_activity_level(problems_count INTEGER)
RETURNS INTEGER AS $$
BEGIN
    CASE 
        WHEN problems_count = 0 THEN RETURN 0;
        WHEN problems_count BETWEEN 1 AND 2 THEN RETURN 1;
        WHEN problems_count BETWEEN 3 AND 4 THEN RETURN 2;
        WHEN problems_count BETWEEN 5 AND 7 THEN RETURN 3;
        WHEN problems_count >= 8 THEN RETURN 4;
        ELSE RETURN 0;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to update user activity when a problem is solved (timezone-aware)
CREATE OR REPLACE FUNCTION increment_user_activity(target_user_id UUID, user_timezone TEXT DEFAULT 'UTC')
RETURNS VOID AS $$
DECLARE
    today_date DATE;
    current_count INTEGER;
    new_level INTEGER;
BEGIN
    -- Get today's date in the user's timezone
    today_date := (NOW() AT TIME ZONE user_timezone)::DATE;
    
    -- Get current count for today or initialize to 0
    SELECT problems_solved INTO current_count
    FROM user_activity 
    WHERE user_id = target_user_id AND date = today_date;
    
    IF current_count IS NULL THEN
        current_count := 0;
    END IF;
    
    -- Increment count
    current_count := current_count + 1;
    
    -- Calculate new activity level
    new_level := calculate_activity_level(current_count);
    
    -- Insert or update the record
    INSERT INTO user_activity (user_id, date, problems_solved, activity_level, timezone)
    VALUES (target_user_id, today_date, current_count, new_level, user_timezone)
    ON CONFLICT (user_id, date)
    DO UPDATE SET 
        problems_solved = current_count,
        activity_level = new_level,
        timezone = user_timezone,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get user's contribution data for the last 365 days (timezone-aware)
CREATE OR REPLACE FUNCTION get_user_contributions(target_user_id UUID, user_timezone TEXT DEFAULT 'UTC')
RETURNS TABLE(
    date DATE,
    count INTEGER,
    level INTEGER
) AS $$
DECLARE
    start_date DATE;
BEGIN
    -- Calculate start date based on user's timezone
    start_date := ((NOW() AT TIME ZONE user_timezone) - INTERVAL '365 days')::DATE;
    
    RETURN QUERY
    SELECT 
        ua.date,
        ua.problems_solved as count,
        ua.activity_level as level
    FROM user_activity ua
    WHERE ua.user_id = target_user_id
    AND ua.date >= start_date
    ORDER BY ua.date;
END;
$$ LANGUAGE plpgsql;

-- Function to get user activity statistics (timezone-aware)
CREATE OR REPLACE FUNCTION get_user_activity_stats(target_user_id UUID, user_timezone TEXT DEFAULT 'UTC')
RETURNS TABLE(
    total_contributions INTEGER,
    current_streak INTEGER,
    longest_streak INTEGER
) AS $$
DECLARE
    total_count INTEGER := 0;
    current_streak_count INTEGER := 0;
    longest_streak_count INTEGER := 0;
    temp_streak INTEGER := 0;
    activity_record RECORD;
    prev_date DATE;
    current_date DATE;
    year_start DATE;
BEGIN
    -- Get current date and year start in user's timezone
    current_date := (NOW() AT TIME ZONE user_timezone)::DATE;
    year_start := DATE_TRUNC('year', NOW() AT TIME ZONE user_timezone)::DATE;
    
    -- Calculate total contributions this year
    SELECT COALESCE(SUM(problems_solved), 0) INTO total_count
    FROM user_activity
    WHERE user_id = target_user_id
    AND date >= year_start;
    
    -- Calculate streaks
    FOR activity_record IN
        SELECT date, problems_solved
        FROM user_activity
        WHERE user_id = target_user_id
        AND problems_solved > 0
        ORDER BY date DESC
    LOOP
        IF prev_date IS NULL THEN
            -- First record (most recent)
            temp_streak := 1;
            current_streak_count := 1;
            prev_date := activity_record.date;
        ELSIF prev_date - activity_record.date = 1 THEN
            -- Consecutive day
            temp_streak := temp_streak + 1;
            IF prev_date = current_date OR prev_date = current_date - 1 THEN
                current_streak_count := temp_streak;
            END IF;
            prev_date := activity_record.date;
        ELSE
            -- Streak broken
            IF temp_streak > longest_streak_count THEN
                longest_streak_count := temp_streak;
            END IF;
            temp_streak := 1;
            prev_date := activity_record.date;
        END IF;
    END LOOP;
    
    -- Check if final streak is the longest
    IF temp_streak > longest_streak_count THEN
        longest_streak_count := temp_streak;
    END IF;
    
    -- If no activity today or yesterday, current streak is 0
    IF NOT EXISTS (
        SELECT 1 FROM user_activity
        WHERE user_id = target_user_id
        AND date IN (current_date, current_date - 1)
        AND problems_solved > 0
    ) THEN
        current_streak_count := 0;
    END IF;
    
    RETURN QUERY SELECT total_count, current_streak_count, longest_streak_count;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Create policy so users can only see their own activity
CREATE POLICY "Users can view their own activity" ON user_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity" ON user_activity
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity" ON user_activity
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON user_activity TO authenticated;
GRANT USAGE ON SEQUENCE user_activity_id_seq TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE user_activity IS 'Tracks daily problem-solving activity for users to generate GitHub-style contribution graphs with timezone support';
COMMENT ON COLUMN user_activity.problems_solved IS 'Number of problems solved on this date';
COMMENT ON COLUMN user_activity.activity_level IS 'Intensity level (0-4) for contribution graph visualization';
COMMENT ON COLUMN user_activity.timezone IS 'User timezone when the activity was recorded';
COMMENT ON FUNCTION increment_user_activity(UUID, TEXT) IS 'Call this function when a user solves a problem to update their daily activity (timezone-aware)';
COMMENT ON FUNCTION get_user_contributions(UUID, TEXT) IS 'Returns contribution data for the last 365 days for visualization (timezone-aware)';
COMMENT ON FUNCTION get_user_activity_stats(UUID, TEXT) IS 'Returns total contributions, current streak, and longest streak for a user (timezone-aware)';
