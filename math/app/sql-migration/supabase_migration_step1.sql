-- Step 1: Create the user_activity table
CREATE TABLE user_activity (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    problems_solved INTEGER DEFAULT 0,
    activity_level INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE UNIQUE INDEX user_activity_user_date_idx ON user_activity(user_id, date);
CREATE INDEX user_activity_user_id_idx ON user_activity(user_id);
CREATE INDEX user_activity_date_idx ON user_activity(date);
