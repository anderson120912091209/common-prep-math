-- ==============================================================================
-- MATH PROBLEMS DATABASE MIGRATION PLAN (FIXED)
-- Safe, incremental migration compatible with existing Supabase setup
-- ==============================================================================

-- STEP 1: CREATE CORE TABLES (NON-BREAKING)
-- ==============================================================================
-- This step creates the new tables without affecting existing functionality

-- Categories first (referenced by other tables)
CREATE TABLE problem_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_name VARCHAR(100) NOT NULL,
    parent_category_id INTEGER REFERENCES problem_categories(id),
    color_hex VARCHAR(7) DEFAULT '#7A9CEB',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main problems table (FIXED: Removed generated search_vector column)
CREATE TABLE math_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200),
    content TEXT NOT NULL,
    content_latex TEXT,
    content_format VARCHAR(20) DEFAULT 'markdown',
    correct_answer TEXT NOT NULL,
    solution_explanation TEXT,
    solution_latex TEXT,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5) NOT NULL,
    difficulty_name VARCHAR(20) DEFAULT 'medium',
    estimated_time_minutes INTEGER,
    problem_type VARCHAR(50) DEFAULT 'multiple_choice',
    answer_format VARCHAR(50) DEFAULT 'text',
    source_name VARCHAR(100),
    source_year INTEGER,
    source_problem_number VARCHAR(20),
    author VARCHAR(100),
    license VARCHAR(50) DEFAULT 'all_rights_reserved',
    learning_objectives TEXT[],
    prerequisites TEXT[],
    total_attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    average_solve_time_seconds INTEGER,
    status VARCHAR(20) DEFAULT 'draft',
    is_public BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    has_image BOOLEAN DEFAULT FALSE,
    has_video BOOLEAN DEFAULT FALSE,
    assets_urls TEXT[],
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: CREATE RELATIONSHIP TABLES
-- ==============================================================================

-- Problem-Category relationships (many-to-many)
CREATE TABLE problem_category_links (
    id SERIAL PRIMARY KEY,
    problem_id UUID NOT NULL REFERENCES math_problems(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES problem_categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(problem_id, category_id)
);

-- Hints system
CREATE TABLE problem_hints (
    id SERIAL PRIMARY KEY,
    problem_id UUID NOT NULL REFERENCES math_problems(id) ON DELETE CASCADE,
    hint_order INTEGER NOT NULL,
    title VARCHAR(100),
    content TEXT NOT NULL,
    content_latex TEXT,
    hint_type VARCHAR(30) DEFAULT 'conceptual',
    reveal_threshold INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(problem_id, hint_order)
);

-- Multiple choice options
CREATE TABLE problem_options (
    id SERIAL PRIMARY KEY,
    problem_id UUID NOT NULL REFERENCES math_problems(id) ON DELETE CASCADE,
    option_order INTEGER NOT NULL,
    content TEXT NOT NULL,
    content_latex TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(problem_id, option_order)
);

-- STEP 3: CREATE PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX idx_math_problems_difficulty ON math_problems(difficulty_level);
CREATE INDEX idx_math_problems_status ON math_problems(status);
CREATE INDEX idx_math_problems_type ON math_problems(problem_type);
CREATE INDEX idx_math_problems_featured ON math_problems(featured) WHERE featured = TRUE;
-- FIXED: Regular text search index instead of generated column
CREATE INDEX idx_math_problems_content_search ON math_problems USING gin(to_tsvector('english', coalesce(title, '') || ' ' || content));
CREATE INDEX idx_problem_category_links_problem ON problem_category_links(problem_id);
CREATE INDEX idx_problem_category_links_category ON problem_category_links(category_id);

-- STEP 4: INSERT SEED DATA
-- ==============================================================================

INSERT INTO problem_categories (name, display_name, description) VALUES
('algebra', '代數', 'Basic algebraic concepts and equations'),
('geometry', '幾何', 'Geometric shapes, proofs, and spatial reasoning'),
('calculus', '微積分', 'Differential and integral calculus'),
('statistics', '統計學', 'Data analysis and statistical methods'),
('linear_algebra', '線性代數', 'Vectors, matrices, and linear transformations'),
('trigonometry', '三角函數', 'Trigonometric functions and identities'),
('probability', '機率論', 'Probability theory and applications'),
('number_theory', '數論', 'Properties and relationships of numbers'),
('competition_math', '競賽數學', 'Mathematical competition problems'),
('applied_math', '應用數學', 'Real-world mathematical applications'),
('ib_mathematics', 'IB 數學', 'International Baccalaureate mathematics'),
('sat_math', 'SAT 數學', 'SAT mathematics preparation'),
('university_math', '大學數學', 'University-level mathematics courses');

-- STEP 5: EXTEND USER ACTIVITY TRACKING (INTEGRATES WITH EXISTING)
-- ==============================================================================
-- This extends your existing user_activity system without breaking it

CREATE TABLE user_problem_attempts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES math_problems(id) ON DELETE CASCADE,
    submitted_answer TEXT,
    is_correct BOOLEAN NOT NULL,
    attempt_number INTEGER DEFAULT 1,
    time_spent_seconds INTEGER,
    hints_used INTEGER[] DEFAULT '{}',
    session_id UUID,
    source VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for user attempts
CREATE INDEX idx_user_attempts_user_date ON user_problem_attempts(user_id, created_at);
CREATE INDEX idx_user_attempts_problem_performance ON user_problem_attempts(problem_id, is_correct);
CREATE INDEX idx_user_attempts_user_problem ON user_problem_attempts(user_id, problem_id);

-- STEP 6: CREATE USEFUL VIEWS
-- ==============================================================================

-- View combining problem with primary category (for easy querying)
CREATE VIEW problems_with_primary_category AS
SELECT 
    p.*,
    pc.name as primary_category_name,
    pc.display_name as primary_category_display
FROM math_problems p
LEFT JOIN problem_category_links pcl ON p.id = pcl.problem_id AND pcl.is_primary = TRUE
LEFT JOIN problem_categories pc ON pcl.category_id = pc.id;

-- View with problem statistics
CREATE VIEW problem_statistics AS
SELECT 
    p.id,
    p.title,
    p.difficulty_level,
    p.total_attempts,
    p.correct_attempts,
    CASE 
        WHEN p.total_attempts > 0 THEN 
            ROUND((p.correct_attempts::DECIMAL / p.total_attempts) * 100, 2)
        ELSE 0 
    END as success_rate_percent,
    COUNT(DISTINCT upa.user_id) as unique_solvers
FROM math_problems p
LEFT JOIN user_problem_attempts upa ON p.id = upa.problem_id AND upa.is_correct = TRUE
GROUP BY p.id, p.title, p.difficulty_level, p.total_attempts, p.correct_attempts;

-- STEP 7: FUNCTIONS TO INTEGRATE WITH EXISTING USER_ACTIVITY
-- ==============================================================================

-- Function to update problem stats when user solves a problem
CREATE OR REPLACE FUNCTION update_problem_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update math_problems table with attempt statistics
    UPDATE math_problems 
    SET 
        total_attempts = total_attempts + 1,
        correct_attempts = CASE WHEN NEW.is_correct THEN correct_attempts + 1 ELSE correct_attempts END,
        updated_at = NOW()
    WHERE id = NEW.problem_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update stats
CREATE TRIGGER trigger_update_problem_stats
    AFTER INSERT ON user_problem_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_problem_stats();

-- STEP 8: MIGRATION HELPER FUNCTIONS
-- ==============================================================================

-- Function to migrate existing hardcoded problems to database
CREATE OR REPLACE FUNCTION migrate_existing_problems()
RETURNS VOID AS $$
DECLARE
    calc_category_id INTEGER;
    algebra_category_id INTEGER;
    stats_category_id INTEGER;
    linear_algebra_category_id INTEGER;
    competition_category_id INTEGER;
BEGIN
    -- Get category IDs
    SELECT id INTO calc_category_id FROM problem_categories WHERE name = 'calculus';
    SELECT id INTO algebra_category_id FROM problem_categories WHERE name = 'algebra';
    SELECT id INTO stats_category_id FROM problem_categories WHERE name = 'statistics';
    SELECT id INTO linear_algebra_category_id FROM problem_categories WHERE name = 'linear_algebra';
    SELECT id INTO competition_category_id FROM problem_categories WHERE name = 'competition_math';
    
    -- Insert a sample problem (replace with your actual problems)
    WITH new_problem AS (
        INSERT INTO math_problems (
            content,
            correct_answer,
            difficulty_level,
            difficulty_name,
            problem_type,
            status,
            is_public
        ) VALUES (
            '解方程式：2x + 5 = 13',
            'x = 4',
            1,
            '基礎',
            'multiple_choice',
            'published',
            TRUE
        ) RETURNING id
    ),
    problem_options_insert AS (
        INSERT INTO problem_options (problem_id, option_order, content, is_correct)
        SELECT id, 1, 'x = 3', FALSE FROM new_problem
        UNION ALL
        SELECT id, 2, 'x = 4', TRUE FROM new_problem
        UNION ALL
        SELECT id, 3, 'x = 5', FALSE FROM new_problem
        UNION ALL
        SELECT id, 4, 'x = 6', FALSE FROM new_problem
    )
    INSERT INTO problem_category_links (problem_id, category_id, is_primary)
    SELECT id, algebra_category_id, TRUE FROM new_problem;
    
    RAISE NOTICE 'Sample problem migrated. Add more INSERT statements for your existing problems.';
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- EXECUTION INSTRUCTIONS
-- ==============================================================================

/*
FIXED VERSION - This migration removes the problematic generated search_vector column
and uses a regular GIN index for text search instead.

TO RUN THIS MIGRATION:

1. Copy and paste the entire migration into your Supabase SQL editor
2. Run it all at once - it should work without errors now
3. After running, call the migration function to import a sample problem:
   SELECT migrate_existing_problems();
4. Test your admin interface!

CHANGES MADE:
- Removed the generated search_vector column that was causing the immutable error
- Added a regular GIN index for text search functionality
- Everything else remains the same and compatible with your admin interface

NEXT STEPS AFTER MIGRATION:
1. Test problem creation in your admin interface
2. Verify data appears in Supabase tables
3. Start creating your math problems!
*/
