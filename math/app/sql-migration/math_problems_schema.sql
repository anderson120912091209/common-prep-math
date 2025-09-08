-- ==============================================================================
-- MATH PROBLEMS DATABASE SCHEMA
-- Comprehensive schema for flexible math problem management
-- ==============================================================================

-- 1. PROBLEM CATEGORIES TABLE (Many-to-Many Support)
-- ============================================================================
CREATE TABLE problem_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_name VARCHAR(100) NOT NULL, -- For UI display (e.g., "微積分")
    parent_category_id INTEGER REFERENCES problem_categories(id), -- For hierarchical categories
    color_hex VARCHAR(7) DEFAULT '#7A9CEB', -- For UI theming
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MATH PROBLEMS MAIN TABLE
-- ============================================================================
CREATE TABLE math_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Content Fields
    title VARCHAR(200), -- Optional title for the problem
    content TEXT NOT NULL, -- The actual question content
    content_latex TEXT, -- LaTeX version for mathematical notation
    content_format VARCHAR(20) DEFAULT 'markdown', -- 'markdown', 'latex', 'html'
    
    -- Answer & Solution
    correct_answer TEXT NOT NULL, -- The correct answer
    solution_explanation TEXT, -- Step-by-step solution explanation
    solution_latex TEXT, -- LaTeX version of solution
    
    -- Difficulty & Metadata
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5) NOT NULL,
    difficulty_name VARCHAR(20) DEFAULT 'medium', -- 'easy', 'medium', 'hard', etc.
    estimated_time_minutes INTEGER, -- Expected solve time
    
    -- Problem Type & Format
    problem_type VARCHAR(50) DEFAULT 'multiple_choice', -- 'multiple_choice', 'free_response', 'true_false', 'fill_blank'
    answer_format VARCHAR(50) DEFAULT 'text', -- 'text', 'number', 'expression', 'graph'
    
    -- Source & Attribution
    source_name VARCHAR(100), -- "IB Mathematics", "AMC 12", etc.
    source_year INTEGER,
    source_problem_number VARCHAR(20),
    author VARCHAR(100),
    license VARCHAR(50) DEFAULT 'all_rights_reserved',
    
    -- Learning & Prerequisites
    learning_objectives TEXT[], -- Array of learning goals
    prerequisites TEXT[], -- What students should know first
    
    -- Usage & Performance Analytics
    total_attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    average_solve_time_seconds INTEGER,
    
    -- Status & Visibility
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'review', 'published', 'archived'
    is_public BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE, -- For highlighting special problems
    
    -- Media & Assets
    has_image BOOLEAN DEFAULT FALSE,
    has_video BOOLEAN DEFAULT FALSE,
    assets_urls TEXT[], -- Array of image/video URLs
    
    -- Metadata
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || 
                   coalesce(array_to_string(learning_objectives, ' '), ''))
    ) STORED
);

-- 3. PROBLEM-CATEGORY JUNCTION TABLE (Many-to-Many)
-- ============================================================================
CREATE TABLE problem_category_links (
    id SERIAL PRIMARY KEY,
    problem_id UUID NOT NULL REFERENCES math_problems(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES problem_categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE, -- Mark one category as primary
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(problem_id, category_id)
);

-- 4. PROBLEM HINTS TABLE (Stepwise Hints)
-- ============================================================================
CREATE TABLE problem_hints (
    id SERIAL PRIMARY KEY,
    problem_id UUID NOT NULL REFERENCES math_problems(id) ON DELETE CASCADE,
    hint_order INTEGER NOT NULL, -- Order of the hint (1, 2, 3...)
    title VARCHAR(100), -- Optional hint title like "Consider the domain"
    content TEXT NOT NULL, -- The actual hint content
    content_latex TEXT, -- LaTeX version
    hint_type VARCHAR(30) DEFAULT 'conceptual', -- 'conceptual', 'calculation', 'strategy', 'check'
    reveal_threshold INTEGER, -- How many attempts before showing this hint
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(problem_id, hint_order)
);

-- 5. MULTIPLE CHOICE OPTIONS (For MC Problems)
-- ============================================================================
CREATE TABLE problem_options (
    id SERIAL PRIMARY KEY,
    problem_id UUID NOT NULL REFERENCES math_problems(id) ON DELETE CASCADE,
    option_order INTEGER NOT NULL, -- A, B, C, D ordering
    content TEXT NOT NULL,
    content_latex TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    explanation TEXT, -- Why this option is correct/incorrect
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(problem_id, option_order)
);

-- 6. PROBLEM TAGS (More Granular than Categories)
-- ============================================================================
CREATE TABLE problem_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#gray',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE problem_tag_links (
    id SERIAL PRIMARY KEY,
    problem_id UUID NOT NULL REFERENCES math_problems(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES problem_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(problem_id, tag_id)
);

-- 7. PROBLEM RELATIONSHIPS (Related/Similar Problems)
-- ============================================================================
CREATE TABLE problem_relationships (
    id SERIAL PRIMARY KEY,
    problem_id UUID NOT NULL REFERENCES math_problems(id) ON DELETE CASCADE,
    related_problem_id UUID NOT NULL REFERENCES math_problems(id) ON DELETE CASCADE,
    relationship_type VARCHAR(30) NOT NULL, -- 'similar', 'prerequisite', 'follow_up', 'variant'
    strength INTEGER CHECK (strength BETWEEN 1 AND 5) DEFAULT 3, -- How strong the relationship is
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(problem_id, related_problem_id, relationship_type),
    CHECK(problem_id != related_problem_id)
);

-- 8. USER PROBLEM ATTEMPTS (Extends existing user_activity)
-- ============================================================================
CREATE TABLE user_problem_attempts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES math_problems(id) ON DELETE CASCADE,
    
    -- Attempt Details
    submitted_answer TEXT,
    is_correct BOOLEAN NOT NULL,
    attempt_number INTEGER DEFAULT 1, -- Multiple attempts per problem
    time_spent_seconds INTEGER,
    hints_used INTEGER[] DEFAULT '{}', -- Array of hint IDs used
    
    -- Context
    session_id UUID, -- Group attempts in same session
    source VARCHAR(50), -- 'practice', 'quiz', 'homework', 'competition'
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- For analytics
    INDEX (user_id, created_at),
    INDEX (problem_id, is_correct),
    INDEX (user_id, problem_id)
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================

-- Search and filtering indexes
CREATE INDEX idx_math_problems_difficulty ON math_problems(difficulty_level);
CREATE INDEX idx_math_problems_status ON math_problems(status);
CREATE INDEX idx_math_problems_type ON math_problems(problem_type);
CREATE INDEX idx_math_problems_featured ON math_problems(featured) WHERE featured = TRUE;
CREATE INDEX idx_math_problems_search ON math_problems USING gin(search_vector);

-- Category and tag indexes
CREATE INDEX idx_problem_category_links_problem ON problem_category_links(problem_id);
CREATE INDEX idx_problem_category_links_category ON problem_category_links(category_id);
CREATE INDEX idx_problem_tag_links_problem ON problem_tag_links(problem_id);

-- Analytics indexes
CREATE INDEX idx_user_attempts_user_date ON user_problem_attempts(user_id, created_at);
CREATE INDEX idx_user_attempts_problem_performance ON user_problem_attempts(problem_id, is_correct);

-- ==============================================================================
-- USEFUL VIEWS
-- ==============================================================================

-- View combining problem with primary category
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

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Insert basic categories
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

-- Insert basic tags for granular classification
INSERT INTO problem_tags (name, description) VALUES
('quadratic_equations', 'Problems involving quadratic equations'),
('integration_by_parts', 'Integration by parts technique'),
('matrix_operations', 'Basic matrix operations'),
('normal_distribution', 'Normal distribution problems'),
('proof_by_induction', 'Mathematical induction proofs'),
('optimization', 'Optimization problems'),
('sequences_series', 'Sequences and series'),
('complex_numbers', 'Complex number operations');
