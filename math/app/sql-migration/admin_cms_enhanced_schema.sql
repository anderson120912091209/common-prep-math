-- ==============================================================================
-- ENHANCED SCHEMA FOR ADMIN CMS + STUDENT PLATFORM
-- Supports teacher content management with student program enrollment
-- ==============================================================================

-- STEP 1: USER ROLES & PERMISSIONS SYSTEM
-- ==============================================================================

CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin', 'content_creator', 'super_admin');

-- Enhanced user profiles with roles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    role user_role NOT NULL DEFAULT 'student',
    display_name VARCHAR(100),
    bio TEXT,
    institution VARCHAR(200), -- School/University affiliation
    teaching_subjects TEXT[], -- For teachers: subjects they can create content for
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: PROGRAMS & CURRICULUM MANAGEMENT
-- ==============================================================================

CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    display_name VARCHAR(200) NOT NULL, -- For UI (e.g., "學測｜數學A")
    program_code VARCHAR(50) UNIQUE, -- Internal code (e.g., "GSAT_MATH_A")
    
    -- Program metadata
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    estimated_duration_weeks INTEGER,
    prerequisites TEXT[],
    learning_outcomes TEXT[],
    
    -- Visual & branding
    color_scheme VARCHAR(50) DEFAULT 'blue',
    icon_url TEXT,
    banner_image_url TEXT,
    
    -- Program status & visibility
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
    is_public BOOLEAN DEFAULT FALSE,
    enrollment_open BOOLEAN DEFAULT TRUE,
    max_students INTEGER, -- Optional enrollment cap
    
    -- Instructor & management
    created_by UUID NOT NULL REFERENCES auth.users(id),
    instructor_ids UUID[] DEFAULT '{}', -- Array of teacher/instructor user IDs
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Program modules/chapters (for organizing content within programs)
CREATE TABLE program_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    module_order INTEGER NOT NULL,
    estimated_hours INTEGER,
    is_required BOOLEAN DEFAULT TRUE,
    unlock_criteria JSONB, -- Conditions to unlock this module
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(program_id, module_order)
);

-- STEP 3: ENHANCED PROBLEM CATEGORIES WITH PROGRAM LINKING
-- ==============================================================================

CREATE TABLE problem_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_name VARCHAR(100) NOT NULL,
    parent_category_id INTEGER REFERENCES problem_categories(id),
    color_hex VARCHAR(7) DEFAULT '#7A9CEB',
    
    -- Program association
    associated_programs UUID[], -- Programs this category is commonly used in
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 4: ENHANCED MATH PROBLEMS WITH PROGRAM ASSIGNMENT
-- ==============================================================================

CREATE TABLE math_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Content fields (same as before)
    title VARCHAR(200),
    content TEXT NOT NULL,
    content_latex TEXT,
    content_format VARCHAR(20) DEFAULT 'markdown',
    correct_answer TEXT NOT NULL,
    solution_explanation TEXT,
    solution_latex TEXT,
    
    -- Difficulty & metadata
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5) NOT NULL,
    difficulty_name VARCHAR(20) DEFAULT 'medium',
    estimated_time_minutes INTEGER,
    problem_type VARCHAR(50) DEFAULT 'multiple_choice',
    answer_format VARCHAR(50) DEFAULT 'text',
    
    -- Source & attribution
    source_name VARCHAR(100),
    source_year INTEGER,
    source_problem_number VARCHAR(20),
    author VARCHAR(100),
    license VARCHAR(50) DEFAULT 'all_rights_reserved',
    
    -- Learning objectives
    learning_objectives TEXT[],
    prerequisites TEXT[],
    
    -- NEW: Program assignment & publishing
    assigned_programs UUID[] DEFAULT '{}', -- Programs this problem is assigned to
    target_module_id UUID REFERENCES program_modules(id), -- Specific module assignment
    
    -- Content management workflow
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'review', 'published', 'archived'
    review_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    review_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Publishing control
    publish_date TIMESTAMP WITH TIME ZONE, -- Scheduled publishing
    expire_date TIMESTAMP WITH TIME ZONE,  -- Auto-archive date
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Usage analytics
    total_attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    average_solve_time_seconds INTEGER,
    
    -- Media assets
    has_image BOOLEAN DEFAULT FALSE,
    has_video BOOLEAN DEFAULT FALSE,
    assets_urls TEXT[],
    
    -- Creator & permissions
    created_by UUID NOT NULL REFERENCES auth.users(id),
    last_modified_by UUID REFERENCES auth.users(id),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || 
                   coalesce(array_to_string(learning_objectives, ' '), ''))
    ) STORED
);

-- STEP 5: STUDENT ENROLLMENT & PROGRAM ASSIGNMENT
-- ==============================================================================

CREATE TABLE program_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    
    -- Enrollment details
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'completed', 'dropped'
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Access control
    access_level VARCHAR(20) DEFAULT 'standard', -- 'standard', 'premium', 'trial'
    expires_at TIMESTAMP WITH TIME ZONE, -- For time-limited access
    
    -- Progress tracking
    current_module_id UUID REFERENCES program_modules(id),
    completed_modules UUID[] DEFAULT '{}',
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Analytics
    total_time_spent_minutes INTEGER DEFAULT 0,
    problems_completed INTEGER DEFAULT 0,
    average_score DECIMAL(5,2),
    
    UNIQUE(student_id, program_id),
    INDEX (student_id, status),
    INDEX (program_id, status)
);

-- STEP 6: ADMIN CONTENT MANAGEMENT FEATURES
-- ==============================================================================

-- Content creation templates (for teachers to quickly create similar problems)
CREATE TABLE problem_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    template_content TEXT NOT NULL, -- Template with placeholders like {{variable}}
    template_variables JSONB, -- Variable definitions and types
    default_difficulty INTEGER,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    is_public BOOLEAN DEFAULT FALSE, -- Share template with other teachers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bulk operations tracking (for when teachers upload many problems at once)
CREATE TABLE content_import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    target_program_id UUID REFERENCES programs(id),
    file_name VARCHAR(255),
    total_records INTEGER,
    processed_records INTEGER DEFAULT 0,
    successful_imports INTEGER DEFAULT 0,
    failed_imports INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    error_log JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Content change log (audit trail for all problem modifications)
CREATE TABLE problem_audit_log (
    id SERIAL PRIMARY KEY,
    problem_id UUID NOT NULL REFERENCES math_problems(id) ON DELETE CASCADE,
    changed_by UUID NOT NULL REFERENCES auth.users(id),
    change_type VARCHAR(50) NOT NULL, -- 'created', 'updated', 'published', 'archived'
    old_values JSONB,
    new_values JSONB,
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX (problem_id, created_at),
    INDEX (changed_by, created_at)
);

-- STEP 7: REAL-TIME NOTIFICATIONS & UPDATES
-- ==============================================================================

CREATE TABLE content_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- 'new_problem', 'program_update', 'assignment_due'
    title VARCHAR(200) NOT NULL,
    message TEXT,
    related_entity_type VARCHAR(50), -- 'problem', 'program', 'module'
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX (recipient_id, is_read, created_at),
    INDEX (notification_type, created_at)
);

-- STEP 8: ENHANCED RELATIONSHIPS & ANALYTICS
-- ==============================================================================

-- Keep existing tables but add program context
CREATE TABLE problem_category_links (
    id SERIAL PRIMARY KEY,
    problem_id UUID NOT NULL REFERENCES math_problems(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES problem_categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(problem_id, category_id)
);

-- Enhanced user attempts with program context
CREATE TABLE user_problem_attempts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES math_problems(id) ON DELETE CASCADE,
    
    -- Attempt details
    submitted_answer TEXT,
    is_correct BOOLEAN NOT NULL,
    attempt_number INTEGER DEFAULT 1,
    time_spent_seconds INTEGER,
    hints_used INTEGER[] DEFAULT '{}',
    
    -- NEW: Program context
    program_id UUID REFERENCES programs(id), -- Which program was this attempted through
    module_id UUID REFERENCES program_modules(id), -- Which module
    assignment_context VARCHAR(50), -- 'practice', 'quiz', 'homework', 'exam'
    
    -- Session tracking
    session_id UUID,
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX (user_id, created_at),
    INDEX (problem_id, is_correct),
    INDEX (program_id, created_at),
    INDEX (user_id, program_id)
);

-- STEP 9: PERMISSIONS & ACCESS CONTROL
-- ==============================================================================

-- Permission system for different user roles
CREATE TABLE content_permissions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL, -- 'program', 'problem', 'category'
    resource_id UUID NOT NULL,
    permission_type VARCHAR(50) NOT NULL, -- 'view', 'edit', 'publish', 'delete', 'assign'
    granted_by UUID REFERENCES auth.users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, resource_type, resource_id, permission_type)
);

-- STEP 10: USEFUL VIEWS FOR ADMIN INTERFACE
-- ==============================================================================

-- View for teachers to see their programs and content
CREATE VIEW teacher_program_overview AS
SELECT 
    p.*,
    COUNT(DISTINCT pe.student_id) as enrolled_students,
    COUNT(DISTINCT mp.id) as total_problems,
    COUNT(DISTINCT mp.id) FILTER (WHERE mp.status = 'published') as published_problems,
    AVG(pe.progress_percentage) as average_student_progress
FROM programs p
LEFT JOIN program_enrollments pe ON p.id = pe.program_id AND pe.status = 'active'
LEFT JOIN math_problems mp ON p.id = ANY(mp.assigned_programs)
GROUP BY p.id;

-- View for student dashboard showing their enrolled programs
CREATE VIEW student_program_dashboard AS
SELECT 
    pe.*,
    p.name as program_name,
    p.display_name,
    p.color_scheme,
    p.icon_url,
    COUNT(DISTINCT mp.id) as total_problems,
    COUNT(DISTINCT upa.problem_id) as attempted_problems,
    COUNT(DISTINCT upa.problem_id) FILTER (WHERE upa.is_correct = true) as solved_problems
FROM program_enrollments pe
JOIN programs p ON pe.program_id = p.id
LEFT JOIN math_problems mp ON p.id = ANY(mp.assigned_programs) AND mp.status = 'published'
LEFT JOIN user_problem_attempts upa ON pe.student_id = upa.user_id AND mp.id = upa.problem_id
WHERE pe.status = 'active'
GROUP BY pe.id, p.id;

-- STEP 11: FUNCTIONS FOR ADMIN WORKFLOW
-- ==============================================================================

-- Function to automatically assign new problems to enrolled students
CREATE OR REPLACE FUNCTION notify_students_of_new_problems()
RETURNS TRIGGER AS $$
BEGIN
    -- When a problem is published and assigned to programs
    IF NEW.status = 'published' AND OLD.status != 'published' THEN
        -- Create notifications for all students in assigned programs
        INSERT INTO content_notifications (
            recipient_id, 
            notification_type, 
            title, 
            message,
            related_entity_type,
            related_entity_id
        )
        SELECT DISTINCT
            pe.student_id,
            'new_problem',
            'New Problem Available: ' || COALESCE(NEW.title, 'Untitled Problem'),
            'A new problem has been added to your program.',
            'problem',
            NEW.id
        FROM program_enrollments pe
        WHERE pe.program_id = ANY(NEW.assigned_programs)
        AND pe.status = 'active';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_problems
    AFTER UPDATE ON math_problems
    FOR EACH ROW
    EXECUTE FUNCTION notify_students_of_new_problems();

-- Function to update program progress when student completes problems
CREATE OR REPLACE FUNCTION update_program_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update on correct attempts
    IF NEW.is_correct AND NEW.program_id IS NOT NULL THEN
        UPDATE program_enrollments
        SET 
            problems_completed = problems_completed + 1,
            last_activity_at = NOW(),
            progress_percentage = LEAST(100.0, 
                (problems_completed + 1.0) / NULLIF(
                    (SELECT COUNT(*) FROM math_problems 
                     WHERE NEW.program_id = ANY(assigned_programs) 
                     AND status = 'published'), 0
                ) * 100.0
            )
        WHERE student_id = NEW.user_id 
        AND program_id = NEW.program_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_program_progress
    AFTER INSERT ON user_problem_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_program_progress();

-- ==============================================================================
-- ADMIN INTERFACE HELPER FUNCTIONS
-- ==============================================================================

-- Function to get problems that need review
CREATE OR REPLACE FUNCTION get_problems_pending_review(reviewer_user_id UUID)
RETURNS TABLE(
    problem_id UUID,
    title VARCHAR,
    created_by_name VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    assigned_programs_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mp.id,
        mp.title,
        up.display_name,
        mp.created_at,
        array_length(mp.assigned_programs, 1)
    FROM math_problems mp
    JOIN user_profiles up ON mp.created_by = up.user_id
    WHERE mp.review_status = 'pending'
    AND mp.status = 'review'
    ORDER BY mp.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to bulk assign problems to programs
CREATE OR REPLACE FUNCTION bulk_assign_problems_to_program(
    problem_ids UUID[],
    target_program_id UUID,
    assigned_by UUID
)
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER := 0;
    problem_id UUID;
BEGIN
    FOREACH problem_id IN ARRAY problem_ids
    LOOP
        UPDATE math_problems 
        SET 
            assigned_programs = array_append(
                COALESCE(assigned_programs, '{}'), 
                target_program_id
            ),
            last_modified_by = assigned_by,
            updated_at = NOW()
        WHERE id = problem_id
        AND NOT (target_program_id = ANY(COALESCE(assigned_programs, '{}')));
        
        IF FOUND THEN
            updated_count := updated_count + 1;
        END IF;
    END LOOP;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- INDEXES FOR ADMIN PERFORMANCE
-- ==============================================================================

-- Admin interface specific indexes
CREATE INDEX idx_programs_instructor ON programs USING gin(instructor_ids);
CREATE INDEX idx_problems_assigned_programs ON math_problems USING gin(assigned_programs);
CREATE INDEX idx_problems_review_status ON math_problems(review_status, status);
CREATE INDEX idx_problems_created_by ON math_problems(created_by, created_at);
CREATE INDEX idx_enrollments_program_status ON program_enrollments(program_id, status);
CREATE INDEX idx_notifications_unread ON content_notifications(recipient_id, is_read, created_at) WHERE is_read = FALSE;
