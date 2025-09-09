// ============================================================================
// STUDENT DATABASE FUNCTIONS
// Functions for fetching problems and programs for the student interface
// ============================================================================

import { supabase } from './supabase';
import { debugProblemsInDatabase } from './admin-db'; // Import debug function

// Types for student interface (matching existing interface)
interface MathQuestion {
  question: string;
  options: string[];
  correct: number;
  difficulty: string;
}

interface MathProgram {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  difficultyColor: string;
  difficultyBgColor: string;
  level: string;
  studentCount: string;
  imageSrc: string;
  gradientFrom: string;
  gradientTo: string;
  questions: MathQuestion[];
}

// ============================================================================
// FETCH PROBLEMS FROM DATABASE
// ============================================================================

export async function getPublishedProblems() {
  try {
    const { data, error } = await supabase
      .from('math_problems')
      .select(`
        *,
        problem_options (
          option_order,
          content,
          is_correct
        ),
        problem_category_links (
          problem_categories (
            name,
            display_name
          )
        )
      `)
      .eq('status', 'published')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching published problems:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getPublishedProblems:', error);
    return null;
  }
}

// ============================================================================
// CONVERT DATABASE PROBLEMS TO STUDENT FORMAT
// ============================================================================

export async function getMathPrograms(): Promise<MathProgram[]> {
  console.log('🔍 [STUDENT] Fetching math programs for student...');
  
  // DEBUG: Check what problems exist in database
  await debugProblemsInDatabase();
  
  const problems = await getPublishedProblems();
  console.log(`🔍 [STUDENT] Found ${problems?.length || 0} published+public problems`);
  
  if (!problems || problems.length === 0) {
    console.log('⚠️ [STUDENT] No published problems found, showing hardcoded fallback');
    // Return fallback hardcoded programs if no database problems yet
    return getHardcodedPrograms();
  }
  
  console.log('✅ [STUDENT] Using database problems for student interface');

  // Group problems by category
  const problemsByCategory = groupProblemsByCategory(problems);
  
  // Convert to MathProgram format
  const programs: MathProgram[] = [];
  
  for (const [categoryName, categoryProblems] of Object.entries(problemsByCategory)) {
    const program = createProgramFromCategory(categoryName, categoryProblems);
    programs.push(program);
  }

  return programs;
}

function groupProblemsByCategory(problems: any[]) {
  const grouped: { [key: string]: any[] } = {};
  
  problems.forEach(problem => {
    // Get primary category or first category
    const category = problem.problem_category_links?.find((link: any) => link.problem_categories)?.problem_categories;
    const categoryName = category?.name || 'algebra'; // Default fallback
    
    if (!grouped[categoryName]) {
      grouped[categoryName] = [];
    }
    grouped[categoryName].push(problem);
  });
  
  return grouped;
}

function createProgramFromCategory(categoryName: string, problems: any[]): MathProgram {
  const categoryConfig = getCategoryConfig(categoryName);
  
  // Convert database problems to MathQuestion format
  const questions: MathQuestion[] = problems.map(problem => ({
    question: problem.content,
    options: problem.problem_options
      ?.sort((a: any, b: any) => a.option_order - b.option_order)
      ?.map((opt: any) => opt.content) || [],
    correct: problem.problem_options
      ?.findIndex((opt: any) => opt.is_correct) || 0,
    difficulty: getDifficultyName(problem.difficulty_level)
  }));

  return {
    id: categoryName,
    title: categoryConfig.title,
    description: categoryConfig.description,
    difficulty: categoryConfig.difficulty,
    difficultyColor: categoryConfig.difficultyColor,
    difficultyBgColor: categoryConfig.difficultyBgColor,
    level: categoryConfig.level,
    studentCount: Math.floor(Math.random() * 3000 + 500).toString(), // Fake count for now
    imageSrc: categoryConfig.imageSrc,
    gradientFrom: categoryConfig.gradientFrom,
    gradientTo: categoryConfig.gradientTo,
    questions
  };
}

function getCategoryConfig(categoryName: string) {
  const configs: { [key: string]: any } = {
    algebra: {
      title: "學測｜數學A",
      description: "代數基礎概念，包含方程式、函數等核心內容。",
      difficulty: "中等",
      difficultyColor: "text-green-600",
      difficultyBgColor: "bg-green-100",
      level: "適合高中程度",
      imageSrc: "/asian-kid-studying.png",
      gradientFrom: "blue-400",
      gradientTo: "blue-600"
    },
    calculus: {
      title: "微積分｜進階",
      description: "微分與積分核心概念，適合理工科系考生。",
      difficulty: "困難",
      difficultyColor: "text-orange-600",
      difficultyBgColor: "bg-orange-100",
      level: "適合大學程度",
      imageSrc: "/calculus.png",
      gradientFrom: "purple-400",
      gradientTo: "purple-600"
    },
    geometry: {
      title: "幾何｜圖形推理",
      description: "平面與立體幾何，空間概念與證明技巧。",
      difficulty: "中等",
      difficultyColor: "text-blue-600",
      difficultyBgColor: "bg-blue-100",
      level: "適合高中程度",
      imageSrc: "/demo3.png",
      gradientFrom: "green-400",
      gradientTo: "green-600"
    },
    statistics: {
      title: "統計學｜數據分析",
      description: "統計概念與數據分析，適合社會科學應用。",
      difficulty: "中等",
      difficultyColor: "text-purple-600",
      difficultyBgColor: "bg-purple-100",
      level: "適合高中程度",
      imageSrc: "/statistics1.png",
      gradientFrom: "yellow-400",
      gradientTo: "yellow-600"
    },
    competition_math: {
      title: "競賽數學｜AMC",
      description: "數學競賽專項訓練，包含奧林匹克數學、AMC等競賽題型。",
      difficulty: "專家",
      difficultyColor: "text-red-600",
      difficultyBgColor: "bg-red-100",
      level: "適合競賽程度",
      imageSrc: "/competitions.png",
      gradientFrom: "red-400",
      gradientTo: "red-600"
    }
  };

  return configs[categoryName] || configs.algebra; // Default fallback
}

function getDifficultyName(level: number): string {
  const names: { [key: number]: string } = {
    1: '基礎',
    2: '簡單', 
    3: '中等',
    4: '困難',
    5: '專家'
  };
  return names[level] || '中等';
}

// ============================================================================
// FALLBACK HARDCODED PROGRAMS (when no database problems)
// ============================================================================

export function getHardcodedPrograms(): MathProgram[] {
  return [
    {
      id: 'math-a',
      title: "學測｜數學A",
      description: "大學學測數學A，涵蓋代數、幾何、統計等核心概念，適合理工科系考生。",
      difficulty: "中等",
      difficultyColor: "text-green-600",
      difficultyBgColor: "bg-green-100",
      level: "適合高中程度",
      studentCount: "2,847",
      imageSrc: "/asian-kid-studying.png",
      gradientFrom: "blue-400",
      gradientTo: "blue-600",
      questions: [
        {
          question: "解方程式：2x + 5 = 13",
          options: ["x = 3", "x = 4", "x = 5", "x = 6"],
          correct: 1,
          difficulty: "基礎"
        },
        {
          question: "若 f(x) = 2x + 3，求 f(5) 的值",
          options: ["10", "11", "12", "13"],
          correct: 3,
          difficulty: "基礎"
        }
      ]
    },
    {
      id: 'calculus',
      title: "微積分｜進階",
      description: "微分與積分核心概念，專為理工科系設計的進階數學課程。",
      difficulty: "困難",
      difficultyColor: "text-orange-600",
      difficultyBgColor: "bg-orange-100",
      level: "適合大學程度",
      studentCount: "1,923",
      imageSrc: "/calculus.png",
      gradientFrom: "purple-400",
      gradientTo: "purple-600",
      questions: [
        {
          question: "求函數 f(x) = x³ - 3x² + 2x 的導數",
          options: ["3x² - 6x + 2", "3x² - 3x + 2", "x² - 6x + 2", "3x² - 6x + 1"],
          correct: 0,
          difficulty: "進階"
        }
      ]
    }
  ];
}
