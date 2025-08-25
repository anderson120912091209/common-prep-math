-- Migration script to add onboarding fields to waitlist table
-- Run this in your Supabase SQL editor

-- Add new columns to the waitlist table
ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS math_interests TEXT[],
ADD COLUMN IF NOT EXISTS current_level TEXT,
ADD COLUMN IF NOT EXISTS study_time TEXT,
ADD COLUMN IF NOT EXISTS learning_goals TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add comments for documentation
COMMENT ON COLUMN waitlist.math_interests IS 'Array of math field interests selected by user';
COMMENT ON COLUMN waitlist.current_level IS 'User''s current math level (beginner, intermediate, advanced, expert)';
COMMENT ON COLUMN waitlist.study_time IS 'User''s preferred study time commitment';
COMMENT ON COLUMN waitlist.learning_goals IS 'User''s learning goals and objectives';
COMMENT ON COLUMN waitlist.onboarding_completed IS 'Whether user has completed the onboarding questionnaire';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_waitlist_onboarding_completed ON waitlist(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_waitlist_math_interests ON waitlist USING GIN(math_interests);
CREATE INDEX IF NOT EXISTS idx_waitlist_current_level ON waitlist(current_level);

-- Update existing records to mark them as having completed onboarding (if they exist)
UPDATE waitlist 
SET onboarding_completed = TRUE 
WHERE onboarding_completed IS NULL;
