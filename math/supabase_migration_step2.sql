-- Step 2: Create the functions
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

CREATE OR REPLACE FUNCTION increment_user_activity(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
    today_date DATE := CURRENT_DATE;
    current_count INTEGER;
    new_level INTEGER;
BEGIN
    SELECT problems_solved INTO current_count
    FROM user_activity 
    WHERE user_id = target_user_id AND date = today_date;
    
    IF current_count IS NULL THEN
        current_count := 0;
    END IF;
    
    current_count := current_count + 1;
    new_level := calculate_activity_level(current_count);
    
    INSERT INTO user_activity (user_id, date, problems_solved, activity_level)
    VALUES (target_user_id, today_date, current_count, new_level)
    ON CONFLICT (user_id, date)
    DO UPDATE SET 
        problems_solved = current_count,
        activity_level = new_level,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
