// ============================================================================
// ADMIN DATABASE FUNCTIONS
// Functions for creating, updating, and managing math problems via admin CMS
// ============================================================================

import { supabase } from './supabase';

// ============================================================================
// TYPES (add these to your lib/supabase.ts if not already there)
// ============================================================================

export interface CreateProblemData {
  title?: string;
  content: string;
  correct_answer: string;
  difficulty_level: 1 | 2 | 3 | 4 | 5;
  problem_type: 'multiple_choice' | 'free_response' | 'true_false' | 'fill_blank';
  solution_explanation?: string;
  estimated_time_minutes?: number;
  options?: {
    content: string;
    is_correct: boolean;
    explanation?: string;
  }[];
  hints?: {
    content: string;
    hint_type: 'conceptual' | 'calculation' | 'strategy' | 'check';
    title?: string;
  }[];
  category_ids?: number[];
}

export interface ProblemFilters {
  category_id?: number;
  difficulty_level?: number;
  status?: 'draft' | 'review' | 'published' | 'archived';
  created_by?: string;
  limit?: number;
}

// ============================================================================
// CATEGORY MANAGEMENT
// ============================================================================

// Debug function to check what problems exist
export async function debugProblemsInDatabase() {
  try {
    const { data: allProblems, error } = await supabase
      .from('math_problems')
      .select('id, title, content, status, is_public, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching all problems:', error);
      return;
    }

    console.log('🔍 ALL PROBLEMS IN DATABASE:');
    console.table(allProblems || []);
    
    const publishedProblems = (allProblems || []).filter(p => p.status === 'published' && p.is_public === true);
    console.log(`📊 STUDENT-VISIBLE PROBLEMS: ${publishedProblems.length}/${(allProblems || []).length}`);
    
    if (publishedProblems.length === 0 && (allProblems || []).length > 0) {
      console.log('⚠️ ISSUE: You have problems but none are published AND public!');
      console.log('💡 SOLUTION: Use updateProblemStatus(problemId, "published") and set is_public = true');
    }
    
    return allProblems;
  } catch (error) {
    console.error('Error debugging problems:', error);
  }
}

export async function ensureDefaultCategories() {
  try {
    // Check if any categories exist
    const { data: existingCategories, error: checkError } = await supabase
      .from('problem_categories')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking categories:', checkError);
      return;
    }

    // If no categories exist, create default ones
    if (!existingCategories || existingCategories.length === 0) {
      const defaultCategories = [
        {
          name: 'basic_algebra',
          display_name: '基礎代數',
          description: '基本代數運算和方程式',
          color_hex: '#7A9CEB'
        },
        {
          name: 'calculus',
          display_name: '微積分',
          description: '微分、積分和極限',
          color_hex: '#10B981'
        },
        {
          name: 'statistics',
          display_name: '統計學',
          description: '統計分析和機率',
          color_hex: '#F59E0B'
        },
        {
          name: 'linear_algebra',
          display_name: '線性代數',
          description: '向量、矩陣和線性變換',
          color_hex: '#EF4444'
        },
        {
          name: 'competition_math',
          display_name: '競賽數學',
          description: '數學競賽和奧林匹克數學',
          color_hex: '#8B5CF6'
        }
      ];

      const { error: insertError } = await supabase
        .from('problem_categories')
        .insert(defaultCategories);

      if (insertError) {
        console.error('Error creating default categories:', insertError);
      } else {
        console.log('✅ Created default categories');
      }
    }
  } catch (error) {
    console.error('Error in ensureDefaultCategories:', error);
  }
}

// ============================================================================
// PROBLEM MANAGEMENT
// ============================================================================

export async function createProblem(problemData: CreateProblemData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  try {
    console.log('🔄 Creating problem with data:', JSON.stringify(problemData, null, 2));
    console.log('🔄 User ID:', user.id);
    
    // Ensure default categories exist
    await ensureDefaultCategories();
    
    // Test database connectivity and permissions
    console.log('🔄 Testing database connectivity...');
    const { data: testData, error: testError } = await supabase
      .from('math_problems')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database access test failed:', testError);
      console.error('❌ This might be a Row Level Security (RLS) issue');
      throw new Error(`Database access denied: ${testError.message}`);
    }
    console.log('✅ Database connectivity OK');
    
    // Test insert permissions specifically
    console.log('🔄 Testing insert permissions...');
    const { data: insertTest, error: insertTestError } = await supabase
      .from('math_problems')
      .insert({
        content: 'TEST INSERT - DELETE ME',
        correct_answer: 'test',
        difficulty_level: 1,
        problem_type: 'multiple_choice',
        created_by: user.id,
        status: 'draft'
      })
      .select()
      .single();
    
    if (insertTestError) {
      console.error('❌ Insert permission test failed:', insertTestError);
      console.error('❌ This is likely a Row Level Security (RLS) policy blocking inserts');
      throw new Error(`Insert permission denied: ${insertTestError.message}`);
    }
    
    // Clean up test record
    if (insertTest) {
      await supabase.from('math_problems').delete().eq('id', insertTest.id);
      console.log('✅ Insert permissions OK (test record cleaned up)');
    }
    
    // Insert the main problem
    const { data: problem, error: problemError } = await supabase
      .from('math_problems')
      .insert({
        title: problemData.title,
        content: problemData.content,
        correct_answer: problemData.correct_answer,
        difficulty_level: problemData.difficulty_level,
        problem_type: problemData.problem_type,
        solution_explanation: problemData.solution_explanation,
        estimated_time_minutes: problemData.estimated_time_minutes,
        created_by: user.id,
        status: 'draft',
        is_public: false, // Private until published
        featured: false,
        total_attempts: 0,
        correct_attempts: 0
      })
      .select()
      .single();

    if (problemError) {
      console.error('Error creating problem:', problemError);
      throw problemError;
    }

    console.log('✅ Problem created:', problem.id);

    // Insert options if provided (for multiple choice problems)
    if (problemData.options && problemData.options.length > 0) {
      const options = problemData.options.map((option, index) => ({
        problem_id: problem.id,
        option_order: index + 1,
        content: option.content,
        is_correct: option.is_correct,
        explanation: option.explanation
      }));

      const { error: optionsError } = await supabase
        .from('problem_options')
        .insert(options);

      if (optionsError) {
        console.error('Error creating options:', optionsError);
        throw optionsError;
      }

      console.log(`✅ Created ${options.length} options`);
    }

    // Insert hints if provided
    if (problemData.hints && problemData.hints.length > 0) {
      const hints = problemData.hints.map((hint, index) => ({
        problem_id: problem.id,
        hint_order: index + 1,
        content: hint.content,
        hint_type: hint.hint_type,
        title: hint.title
      }));

      const { error: hintsError } = await supabase
        .from('problem_hints')
        .insert(hints);

      if (hintsError) {
        console.error('Error creating hints:', hintsError);
        throw hintsError;
      }

      console.log(`✅ Created ${hints.length} hints`);
    }

    // Link to categories if provided and valid
    if (problemData.category_ids && problemData.category_ids.length > 0) {
      // First check if all category IDs actually exist
      const { data: existingCategories, error: categoryCheckError } = await supabase
        .from('problem_categories')
        .select('id')
        .in('id', problemData.category_ids);
      
      if (categoryCheckError) {
        console.error('Error checking category existence:', categoryCheckError);
        // Continue without linking categories rather than failing
      } else if (existingCategories && existingCategories.length > 0) {
        const validCategoryIds = existingCategories.map(cat => cat.id);
        const categoryLinks = validCategoryIds.map((categoryId, index) => ({
          problem_id: problem.id,
          category_id: categoryId,
          is_primary: index === 0 // First category is primary
        }));

        const { error: categoryError } = await supabase
          .from('problem_category_links')
          .insert(categoryLinks);

        if (categoryError) {
          console.error('Error linking categories:', categoryError);
          // Log but don't throw - problem creation can succeed without categories
          console.log('⚠️ Continuing without category links');
        } else {
          console.log(`✅ Linked to ${categoryLinks.length} categories`);
        }
      } else {
        console.log('⚠️ No valid categories found to link');
      }
    } else {
      console.log('ℹ️ No categories provided for linking');
    }

    return problem;
  } catch (error) {
    console.error('❌ Error in createProblem:', error);
    console.error('❌ Error details:', JSON.stringify(error, null, 2));
    console.error('❌ Problem data:', JSON.stringify(problemData, null, 2));
    
    // Re-throw with more specific error message
    if (error instanceof Error) {
      throw new Error(`Problem creation failed: ${error.message}`);
    } else {
      throw new Error(`Problem creation failed: ${JSON.stringify(error)}`);
    }
  }
}

export async function getProblems(filters?: ProblemFilters) {
  try {
    let query = supabase
      .from('math_problems')
      .select(`
        *,
        problem_options(*),
        problem_hints(*),
        problem_category_links(
          is_primary,
          problem_categories(*)
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.difficulty_level) {
      query = query.eq('difficulty_level', filters.difficulty_level);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.created_by) {
      query = query.eq('created_by', filters.created_by);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching problems:', error);
      throw error;
    }

    console.log(`✅ Fetched ${data?.length || 0} problems`);
    return data;
  } catch (error) {
    console.error('Error in getProblems:', error);
    throw error;
  }
}

export async function updateProblemStatus(problemId: string, status: 'draft' | 'review' | 'published' | 'archived') {
  try {
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    };
    
    // When publishing, also make public so students can see it
    if (status === 'published') {
      updateData.is_public = true;
      console.log(`📤 Publishing problem ${problemId} - making it visible to students`);
    }
    
    // When unpublishing, make private
    if (status === 'draft' || status === 'archived') {
      updateData.is_public = false;
      console.log(`📥 Unpublishing problem ${problemId} - hiding from students`);
    }

    const { data, error } = await supabase
      .from('math_problems')
      .update(updateData)
      .eq('id', problemId)
      .select()
      .single();

    if (error) {
      console.error('Error updating problem status:', error);
      throw error;
    }

    console.log(`✅ Updated problem ${problemId} status to ${status}`);
    return data;
  } catch (error) {
    console.error('Error in updateProblemStatus:', error);
    throw error;
  }
}

// Quick publish function for ease of use
export async function publishProblem(problemId: string) {
  return updateProblemStatus(problemId, 'published');
}

// Quick unpublish function  
export async function unpublishProblem(problemId: string) {
  return updateProblemStatus(problemId, 'draft');
}

export async function deleteProblem(problemId: string) {
  try {
    // Delete related data first (CASCADE should handle this, but being explicit)
    await supabase.from('problem_options').delete().eq('problem_id', problemId);
    await supabase.from('problem_hints').delete().eq('problem_id', problemId);
    await supabase.from('problem_category_links').delete().eq('problem_id', problemId);
    
    // Delete the main problem
    const { error } = await supabase
      .from('math_problems')
      .delete()
      .eq('id', problemId);

    if (error) {
      console.error('Error deleting problem:', error);
      throw error;
    }

    console.log(`✅ Deleted problem ${problemId}`);
  } catch (error) {
    console.error('Error in deleteProblem:', error);
    throw error;
  }
}

// ============================================================================
// CATEGORY MANAGEMENT
// ============================================================================

export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('problem_categories')
      .select('*')
      .order('display_name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    console.log(`✅ Fetched ${data?.length || 0} categories`);
    return data;
  } catch (error) {
    console.error('Error in getCategories:', error);
    throw error;
  }
}

export async function createCategory(categoryData: {
  name: string;
  display_name: string;
  description?: string;
  color_hex?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('problem_categories')
      .insert({
        ...categoryData,
        color_hex: categoryData.color_hex || '#7A9CEB'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }

    console.log(`✅ Created category: ${data.display_name}`);
    return data;
  } catch (error) {
    console.error('Error in createCategory:', error);
    throw error;
  }
}

// ============================================================================
// ANALYTICS & STATS
// ============================================================================

export async function getAdminStats() {
  try {
    // Get problem count
    const { count: problemCount } = await supabase
      .from('math_problems')
      .select('*', { count: 'exact', head: true });

    // Get published problem count
    const { count: publishedCount } = await supabase
      .from('math_problems')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    // Get student count (from your existing waitlist)
    const { count: studentCount } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('onboarding_completed', true);

    // Get category count
    const { count: categoryCount } = await supabase
      .from('problem_categories')
      .select('*', { count: 'exact', head: true });

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { count: recentActivity } = await supabase
      .from('user_activity')
      .select('*', { count: 'exact', head: true })
      .gte('date', sevenDaysAgo);

    // Get total attempts if user_problem_attempts table exists
    let totalAttempts = 0;
    try {
      const { count: attemptCount } = await supabase
        .from('user_problem_attempts')
        .select('*', { count: 'exact', head: true });
      totalAttempts = attemptCount || 0;
    } catch {
      // Table might not exist yet
    }

    const stats = {
      problemCount: problemCount || 0,
      publishedCount: publishedCount || 0,
      studentCount: studentCount || 0,
      categoryCount: categoryCount || 0,
      recentActivity: recentActivity || 0,
      totalAttempts
    };

    console.log('✅ Admin stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error in getAdminStats:', error);
    // Return default stats if there's an error
    return {
      problemCount: 0,
      publishedCount: 0,
      studentCount: 0,
      categoryCount: 0,
      recentActivity: 0,
      totalAttempts: 0
    };
  }
}

export async function getProblemAnalytics(problemId: string) {
  try {
    // Get problem attempts
    const { data: attempts, error: attemptsError } = await supabase
      .from('user_problem_attempts')
      .select('*')
      .eq('problem_id', problemId);

    if (attemptsError) throw attemptsError;

    // Calculate stats
    const totalAttempts = attempts?.length || 0;
    const correctAttempts = attempts?.filter(a => a.is_correct).length || 0;
    const successRate = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
    const averageTime = attempts?.length 
      ? attempts.reduce((sum, a) => sum + (a.time_spent_seconds || 0), 0) / attempts.length 
      : 0;

    return {
      totalAttempts,
      correctAttempts,
      successRate: Math.round(successRate * 100) / 100,
      averageTime: Math.round(averageTime),
      uniqueUsers: new Set(attempts?.map(a => a.user_id)).size
    };
  } catch (error) {
    console.error('Error in getProblemAnalytics:', error);
    return {
      totalAttempts: 0,
      correctAttempts: 0,
      successRate: 0,
      averageTime: 0,
      uniqueUsers: 0
    };
  }
}

// ============================================================================
// STUDENT INTERFACE FUNCTIONS
// ============================================================================

export async function getProblemsForStudent(filters?: {
  category_id?: number;
  difficulty_level?: number;
  limit?: number;
}) {
  // Only return published problems for students
  return getProblems({
    ...filters,
    status: 'published'
  });
}

export async function recordProblemAttempt(data: {
  problem_id: string;
  submitted_answer?: string;
  is_correct: boolean;
  time_spent_seconds?: number;
  hints_used?: number[];
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  try {
    // Record the attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('user_problem_attempts')
      .insert({
        user_id: user.id,
        problem_id: data.problem_id,
        submitted_answer: data.submitted_answer,
        is_correct: data.is_correct,
        time_spent_seconds: data.time_spent_seconds,
        hints_used: data.hints_used || []
      })
      .select()
      .single();

    if (attemptError) throw attemptError;

    // Update problem statistics
    if (data.is_correct) {
      await supabase.rpc('increment_problem_stats', {
        p_problem_id: data.problem_id,
        p_is_correct: true
      });
    } else {
      await supabase.rpc('increment_problem_stats', {
        p_problem_id: data.problem_id,
        p_is_correct: false
      });
    }

    console.log(`✅ Recorded attempt for problem ${data.problem_id}`);
    return attempt;
  } catch (error) {
    console.error('Error recording problem attempt:', error);
    throw error;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export async function checkAdminAccess(userId: string, email: string): Promise<boolean> {
  // Email whitelist (same as in middleware)
  const ADMIN_EMAILS = [
    'chenzhengyang070@gmail.com',      
  ];

  // Check email whitelist first
  if (ADMIN_EMAILS.includes(email.toLowerCase())) {
    return true;
  }

  // Check database role (if you implement user_profiles later)
  try {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_admin, role')
      .eq('user_id', userId)
      .single();

    return profile?.is_admin || 
           ['teacher', 'admin', 'content_creator'].includes(profile?.role);
  } catch {
    // user_profiles table might not exist yet
    return false;
  }
}

export function formatDifficulty(level: number): string {
  const levels = {
    1: '基礎',
    2: '簡單', 
    3: '中等',
    4: '困難',
    5: '專家'
  };
  return levels[level as keyof typeof levels] || '未知';
}

export function formatProblemType(type: string): string {
  const types = {
    'multiple_choice': '選擇題',
    'free_response': '自由作答',
    'true_false': '是非題',
    'fill_blank': '填空題'
  };
  return types[type as keyof typeof types] || type;
}
