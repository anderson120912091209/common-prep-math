-- Step 3: Create query functions
CREATE OR REPLACE FUNCTION get_user_contributions(target_user_id UUID)
RETURNS TABLE(
    date DATE,
    count INTEGER,
    level INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ua.date,
        ua.problems_solved as count,
        ua.activity_level as level
    FROM user_activity ua
    WHERE ua.user_id = target_user_id
    AND ua.date >= CURRENT_DATE - INTERVAL '365 days'
    ORDER BY ua.date;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_activity_stats(target_user_id UUID)
RETURNS TABLE(
    total_contributions INTEGER,
    current_streak INTEGER,
    longest_streak INTEGER
) AS $$
DECLARE
    total_count INTEGER := 0;
    current_streak_count INTEGER := 0;
    longest_streak_count INTEGER := 0;
BEGIN
    SELECT COALESCE(SUM(problems_solved), 0) INTO total_count
    FROM user_activity
    WHERE user_id = target_user_id
    AND date >= DATE_TRUNC('year', CURRENT_DATE);
    
    -- Simplified streak calculation for now
    SELECT COUNT(*) INTO current_streak_count
    FROM user_activity
    WHERE user_id = target_user_id
    AND problems_solved > 0
    AND date >= CURRENT_DATE - INTERVAL '7 days';
    
    longest_streak_count := current_streak_count;
    
    RETURN QUERY SELECT total_count, current_streak_count, longest_streak_count;
END;
$$ LANGUAGE plpgsql;
