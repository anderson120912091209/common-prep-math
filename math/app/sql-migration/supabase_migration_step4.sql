-- Step 4: Set up security and permissions
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity" ON user_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity" ON user_activity
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity" ON user_activity
    FOR UPDATE USING (auth.uid() = user_id);

GRANT ALL ON user_activity TO authenticated;
GRANT USAGE ON SEQUENCE user_activity_id_seq TO authenticated;
