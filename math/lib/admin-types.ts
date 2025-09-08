// ==============================================================================
// TYPESCRIPT INTERFACES FOR ADMIN CMS + ENHANCED STUDENT CLIENT
// These interfaces match the enhanced database schema
// ==============================================================================

// BASE USER SYSTEM
// ==============================================================================

export type UserRole = 'student' | 'teacher' | 'admin' | 'content_creator' | 'super_admin';

export interface UserProfile {
  id: string;
  user_id: string;
  role: UserRole;
  display_name?: string;
  bio?: string;
  institution?: string;
  teaching_subjects?: string[];
  created_at: string;
  updated_at: string;
}

// PROGRAMS & CURRICULUM
// ==============================================================================

export interface Program {
  id: string;
  name: string;
  description?: string;
  display_name: string;
  program_code?: string;
  difficulty_level?: number;
  estimated_duration_weeks?: number;
  prerequisites?: string[];
  learning_outcomes?: string[];
  color_scheme?: string;
  icon_url?: string;
  banner_image_url?: string;
  status: 'draft' | 'published' | 'archived';
  is_public: boolean;
  enrollment_open: boolean;
  max_students?: number;
  created_by: string;
  instructor_ids?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProgramModule {
  id: string;
  program_id: string;
  name: string;
  description?: string;
  module_order: number;
  estimated_hours?: number;
  is_required: boolean;
  unlock_criteria?: Record<string, any>;
  created_at: string;
}

export interface ProgramEnrollment {
  id: string;
  student_id: string;
  program_id: string;
  enrollment_date: string;
  status: 'active' | 'paused' | 'completed' | 'dropped';
  progress_percentage: number;
  access_level: 'standard' | 'premium' | 'trial';
  expires_at?: string;
  current_module_id?: string;
  completed_modules?: string[];
  last_activity_at: string;
  total_time_spent_minutes: number;
  problems_completed: number;
  average_score?: number;
}

// ENHANCED MATH PROBLEMS
// ==============================================================================

export interface MathProblem {
  id: string;
  title?: string;
  content: string;
  content_latex?: string;
  content_format: 'markdown' | 'latex' | 'html';
  correct_answer: string;
  solution_explanation?: string;
  solution_latex?: string;
  
  // Difficulty & metadata
  difficulty_level: 1 | 2 | 3 | 4 | 5;
  difficulty_name?: string;
  estimated_time_minutes?: number;
  problem_type: 'multiple_choice' | 'free_response' | 'true_false' | 'fill_blank';
  answer_format: 'text' | 'number' | 'expression' | 'graph';
  
  // Source & attribution
  source_name?: string;
  source_year?: number;
  source_problem_number?: string;
  author?: string;
  license?: string;
  
  // Learning
  learning_objectives?: string[];
  prerequisites?: string[];
  
  // Program assignment
  assigned_programs?: string[];
  target_module_id?: string;
  
  // Publishing workflow
  status: 'draft' | 'review' | 'published' | 'archived';
  review_status: 'pending' | 'approved' | 'rejected';
  review_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  publish_date?: string;
  expire_date?: string;
  is_featured: boolean;
  
  // Analytics
  total_attempts: number;
  correct_attempts: number;
  average_solve_time_seconds?: number;
  
  // Media
  has_image: boolean;
  has_video: boolean;
  assets_urls?: string[];
  
  // Metadata
  created_by: string;
  last_modified_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ProblemOption {
  id: number;
  problem_id: string;
  option_order: number;
  content: string;
  content_latex?: string;
  is_correct: boolean;
  explanation?: string;
  created_at: string;
}

export interface ProblemHint {
  id: number;
  problem_id: string;
  hint_order: number;
  title?: string;
  content: string;
  content_latex?: string;
  hint_type: 'conceptual' | 'calculation' | 'strategy' | 'check';
  reveal_threshold?: number;
  created_at: string;
  updated_at: string;
}

// CATEGORIES & ORGANIZATION
// ==============================================================================

export interface ProblemCategory {
  id: number;
  name: string;
  description?: string;
  display_name: string;
  parent_category_id?: number;
  color_hex: string;
  associated_programs?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProblemTag {
  id: number;
  name: string;
  description?: string;
  color: string;
  created_at: string;
}

// USER INTERACTIONS & ANALYTICS
// ==============================================================================

export interface UserProblemAttempt {
  id: number;
  user_id: string;
  problem_id: string;
  submitted_answer?: string;
  is_correct: boolean;
  attempt_number: number;
  time_spent_seconds?: number;
  hints_used?: number[];
  program_id?: string;
  module_id?: string;
  assignment_context?: 'practice' | 'quiz' | 'homework' | 'exam';
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ADMIN CMS SPECIFIC INTERFACES
// ==============================================================================

export interface ProblemTemplate {
  id: string;
  name: string;
  description?: string;
  template_content: string;
  template_variables?: Record<string, any>;
  default_difficulty?: number;
  created_by: string;
  is_public: boolean;
  created_at: string;
}

export interface ContentImportJob {
  id: string;
  created_by: string;
  target_program_id?: string;
  file_name?: string;
  total_records?: number;
  processed_records: number;
  successful_imports: number;
  failed_imports: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_log?: Record<string, any>;
  created_at: string;
  completed_at?: string;
}

export interface ContentNotification {
  id: string;
  recipient_id: string;
  notification_type: 'new_problem' | 'program_update' | 'assignment_due';
  title: string;
  message?: string;
  related_entity_type?: 'problem' | 'program' | 'module';
  related_entity_id?: string;
  is_read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
}

// ENHANCED VIEW INTERFACES
// ==============================================================================

export interface ProblemWithCategory extends MathProblem {
  primary_category_name?: string;
  primary_category_display?: string;
  categories?: ProblemCategory[];
  options?: ProblemOption[];
  hints?: ProblemHint[];
}

export interface TeacherProgramOverview extends Program {
  enrolled_students: number;
  total_problems: number;
  published_problems: number;
  average_student_progress: number;
}

export interface StudentProgramDashboard extends ProgramEnrollment {
  program_name: string;
  display_name: string;
  color_scheme?: string;
  icon_url?: string;
  total_problems: number;
  attempted_problems: number;
  solved_problems: number;
}

export interface ProblemStatistics {
  id: string;
  title?: string;
  difficulty_level: number;
  total_attempts: number;
  correct_attempts: number;
  success_rate_percent: number;
  unique_solvers: number;
}

// API RESPONSE TYPES
// ==============================================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  count?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
}

// FORM INTERFACES FOR ADMIN CMS
// ==============================================================================

export interface CreateProblemForm {
  title?: string;
  content: string;
  content_latex?: string;
  difficulty_level: 1 | 2 | 3 | 4 | 5;
  problem_type: 'multiple_choice' | 'free_response' | 'true_false' | 'fill_blank';
  assigned_programs: string[];
  category_ids: number[];
  tag_ids?: number[];
  estimated_time_minutes?: number;
  learning_objectives?: string[];
  
  // For multiple choice
  options?: {
    content: string;
    content_latex?: string;
    is_correct: boolean;
    explanation?: string;
  }[];
  
  // Solution
  solution_explanation?: string;
  solution_latex?: string;
  
  // Hints
  hints?: {
    title?: string;
    content: string;
    content_latex?: string;
    hint_type: 'conceptual' | 'calculation' | 'strategy' | 'check';
  }[];
}

export interface CreateProgramForm {
  name: string;
  display_name: string;
  description?: string;
  difficulty_level?: number;
  estimated_duration_weeks?: number;
  prerequisites?: string[];
  learning_outcomes?: string[];
  color_scheme?: string;
  is_public: boolean;
  enrollment_open: boolean;
  max_students?: number;
  instructor_ids?: string[];
}

// DASHBOARD DATA INTERFACES
// ==============================================================================

export interface TeacherDashboardData {
  myPrograms: TeacherProgramOverview[];
  pendingReviews: MathProblem[];
  recentActivity: UserProblemAttempt[];
  contentStats: {
    totalProblems: number;
    totalStudents: number;
    avgCompletion: number;
    totalPrograms: number;
  };
  notifications: ContentNotification[];
}

export interface StudentDashboardData {
  enrolledPrograms: StudentProgramDashboard[];
  recentActivity: UserProblemAttempt[];
  upcomingDeadlines: any[]; // TODO: Define assignment types
  achievements: any[]; // TODO: Define achievement system
  notifications: ContentNotification[];
  progressStats: {
    totalProblemsAttempted: number;
    totalProblemsSolved: number;
    currentStreak: number;
    totalTimeSpent: number;
  };
}

export interface AnalyticsDashboardData {
  programPerformance: {
    program: Program;
    enrolledStudents: number;
    averageProgress: number;
    problemsCompleted: number;
    strugglingStudents: UserProfile[];
  }[];
  
  problemAnalytics: (ProblemStatistics & {
    commonMistakes: { answer: string; count: number }[];
    timeDistribution: { range: string; count: number }[];
  })[];
  
  studentInsights: {
    topPerformers: (UserProfile & { score: number })[];
    needsAttention: (UserProfile & { reason: string })[];
    engagementMetrics: {
      dailyActiveUsers: number;
      sessionDuration: number;
      retentionRate: number;
      completionRate: number;
    };
  };
}

// UTILITY TYPES
// ==============================================================================

export type ProblemStatus = MathProblem['status'];
export type ReviewStatus = MathProblem['review_status'];
export type EnrollmentStatus = ProgramEnrollment['status'];
export type NotificationType = ContentNotification['notification_type'];

// Filters for API queries
export interface ProblemFilters {
  program_ids?: string[];
  category_ids?: number[];
  difficulty_levels?: number[];
  status?: ProblemStatus[];
  created_by?: string;
  search?: string;
}

export interface ProgramFilters {
  instructor_id?: string;
  status?: Program['status'][];
  difficulty_levels?: number[];
  search?: string;
}

// API Function Types
export type CreateProblemFunction = (problem: CreateProblemForm) => Promise<ApiResponse<MathProblem>>;
export type UpdateProblemFunction = (id: string, updates: Partial<MathProblem>) => Promise<ApiResponse<MathProblem>>;
export type GetProblemsFunction = (filters?: ProblemFilters, page?: number, limit?: number) => Promise<PaginatedResponse<ProblemWithCategory>>;
export type BulkAssignProblemsFunction = (problemIds: string[], programId: string) => Promise<ApiResponse<{ updated_count: number }>>;

// React Hook Return Types
export interface UseProgramsHook {
  programs: Program[];
  loading: boolean;
  error: string | null;
  createProgram: (program: CreateProgramForm) => Promise<void>;
  updateProgram: (id: string, updates: Partial<Program>) => Promise<void>;
  deleteProgram: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export interface UseProblemsHook {
  problems: ProblemWithCategory[];
  loading: boolean;
  error: string | null;
  filters: ProblemFilters;
  setFilters: (filters: ProblemFilters) => void;
  createProblem: CreateProblemFunction;
  updateProblem: UpdateProblemFunction;
  deleteProblem: (id: string) => Promise<void>;
  bulkAssign: BulkAssignProblemsFunction;
  refresh: () => Promise<void>;
}
