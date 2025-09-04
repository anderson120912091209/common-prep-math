'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import ProgramCard from '../../components/ProgramCard';
import ContributionTable from '../../components/ContributionTable';

interface UserData {
  name: string;
  email: string;
  avatar_url?: string;
  math_interests?: string[];
  current_level?: string;
  study_time?: string;
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

interface MathQuestion {
  question: string;
  options: string[];
  correct: number;
  difficulty: string;
}

export default function TestingProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<MathProgram | null>(null);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contributions, setContributions] = useState<any[]>([]);
  const [activityStats, setActivityStats] = useState({
    total_contributions: 0,
    current_streak: 0,
    longest_streak: 0
  });

  // Math programs with their questions
  const mathPrograms: MathProgram[] = [
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
      id: 'math-b',
      title: "學測｜數學B",
      description: "大學學測數學B，專注於統計與機率，適合商管、社會科學等科系考生。",
      difficulty: "基礎",
      difficultyColor: "text-blue-600",
      difficultyBgColor: "bg-blue-100",
      level: "適合高中程度",
      studentCount: "1,923",
      imageSrc: "/asian-kid-studying.png",
      gradientFrom: "green-400",
      gradientTo: "green-600",
      questions: [
        {
          question: "一副標準撲克牌抽到紅心的機率是多少？",
          options: ["1/2", "1/3", "1/4", "1/5"],
          correct: 2,
          difficulty: "基礎"
        },
        {
          question: "數據集 {2, 4, 6, 8, 10} 的平均數是多少？",
          options: ["5", "6", "7", "8"],
          correct: 1,
          difficulty: "基礎"
        }
      ]
    },
    {
      id: 'calculus',
      title: "考研｜微積分",
      description: "大學微積分課程，包含極限、導數、積分等核心概念，適合理工科系學生。",
      difficulty: "進階",
      difficultyColor: "text-orange-600",
      difficultyBgColor: "bg-orange-100",
      level: "適合大學程度",
      studentCount: "3,456",
      imageSrc: "/calcimage.png",
      gradientFrom: "purple-400",
      gradientTo: "purple-600",
      questions: [
        {
          question: "計算 lim(x→0) (sin x / x) 的值",
          options: ["0", "1", "∞", "不存在"],
          correct: 1,
          difficulty: "進階"
        },
        {
          question: "求函數 f(x) = x³ - 3x² + 2 的導數",
          options: ["3x² - 6x", "x² - 3x", "3x² - 3x", "3x² - 6x + 2"],
          correct: 0,
          difficulty: "進階"
        }
      ]
    },
    {
      id: 'statistics',
      title: "大學｜統計學",
      description: "統計學基礎課程，涵蓋描述統計、推論統計、機率論等實用概念。",
      difficulty: "中等",
      difficultyColor: "text-green-600",
      difficultyBgColor: "bg-green-100",
      level: "適合大學程度",
      studentCount: "2,134",
      imageSrc: "/statistics2.png",
      gradientFrom: "orange-400",
      gradientTo: "orange-600",
      questions: [
        {
          question: "標準常態分配的平均數和標準差分別是？",
          options: ["0, 1", "1, 0", "0, 0", "1, 1"],
          correct: 0,
          difficulty: "中等"
        }
      ]
    },
    {
      id: 'linear-algebra',
      title: "大學｜線性代數",
      description: "線性代數基礎課程，包含向量、矩陣、特徵值等核心概念。",
      difficulty: "進階",
      difficultyColor: "text-orange-600",
      difficultyBgColor: "bg-orange-100",
      level: "適合大學程度",
      studentCount: "1,876",
      imageSrc: "/linear-algebra.png",
      gradientFrom: "red-400",
      gradientTo: "red-600",
      questions: [
        {
          question: "2×2 單位矩陣是什麼？",
          options: ["[1 0; 0 1]", "[0 1; 1 0]", "[1 1; 1 1]", "[2 0; 0 2]"],
          correct: 0,
          difficulty: "進階"
        }
      ]
    },
    {
      id: 'competition',
      title: "競賽數學｜AMC",
      description: "數學競賽專項訓練，包含奧林匹克數學、AMC等競賽題型解析。",
      difficulty: "專家",
      difficultyColor: "text-red-600",
      difficultyBgColor: "bg-red-100",
      level: "適合競賽程度",
      studentCount: "956",
      imageSrc: "/competitions.png",
      gradientFrom: "yellow-400",
      gradientTo: "yellow-600",
      questions: [
        {
          question: "若 a + b + c = 6 且 ab + bc + ca = 11，求 a² + b² + c² 的值",
          options: ["14", "15", "16", "17"],
          correct: 0,
          difficulty: "專家"
        }
      ]
    }
  ];

  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          router.push('/waitlist');
          return;
        }

        setUser(user);

        const { data: waitlistUser, error: waitlistError } = await supabase
          .from('waitlist')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (waitlistError || !waitlistUser) {
          router.push('/waitlist');
          return;
        }

        setUserData({
          name: waitlistUser.name || user.user_metadata?.name || 'User',
          email: waitlistUser.email || user.email || '',
          avatar_url: user.user_metadata?.avatar_url,
          math_interests: waitlistUser.math_interests,
          current_level: waitlistUser.current_level,
          study_time: waitlistUser.study_time
        });

        // Load user contributions and activity stats
        await loadUserActivity(user.id);

      } catch (error) {
        console.error('Error checking user access:', error);
        router.push('/waitlist');
      } finally {
        setLoading(false);
      }
    };

    checkUserAccess();
  }, [router]);

  const loadUserActivity = async (userId: string) => {
    try {
      
      // Get user contributions for the last 365 days
      const { data: contributionsData, error: contributionsError } = await supabase
        .rpc('get_user_contributions', { 
          target_user_id: userId
        });

      if (contributionsError) {
        console.log('Activity tracking not set up yet - using mock data');
        setContributions([]); // Empty contributions for now
      } else {
        setContributions(contributionsData || []);
      }

      // Get user activity statistics
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_user_activity_stats', { 
          target_user_id: userId
        });

      if (statsError) {
        console.log('Activity stats not set up yet - using default values');
        setActivityStats({ total_contributions: 0, current_streak: 0, longest_streak: 0 });
      } else if (statsData && statsData.length > 0) {
        setActivityStats(statsData[0]);
      }
    } catch (error) {
      console.error('Error loading user activity:', error);
    }
  };

  const handleProgramSelect = (program: MathProgram) => {
    setSelectedProgram(program);
    setCurrentProblem(0);
    setActiveTab('practice');
  };

  const handleAnswerSelect = async (selectedIndex: number) => {
    if (!selectedProgram || !user) return;
    
    const isCorrect = selectedIndex === selectedProgram.questions[currentProblem].correct;
    
    if (isCorrect) {
      alert('正確！🎉 +1 活動點數');
      
      // Track the solved problem in user activity
      try {        
        const { error } = await supabase.rpc('increment_user_activity', {
          target_user_id: user.id
        });
        
        if (error) {
          console.error('Error tracking activity:', error);
        } else {
          console.log('✅ Activity tracked: +1 point for solving problem');
          // Refresh activity data to update the contribution table
          await loadUserActivity(user.id);
        }
      } catch (error) {
        console.error('Error calling increment_user_activity:', error);
      }
    } else {
      alert('再試試看！💪');
    }
    
    if (currentProblem < selectedProgram.questions.length - 1) {
      setCurrentProblem(currentProblem + 1);
    } else {
      alert('恭喜完成所有題目！這只是產品的一小部分預覽。');
      setCurrentProblem(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8F4FD] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A9CEB] mx-auto mb-4"></div>
          <p className="text-gray-600">正在載入測試版產品...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static absolute z-50 transition-transform duration-300 ease-in-out`}>
        <div className="w-80 bg-white h-screen shadow-xl border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <Link href="/" className="flex items-center mb-4">
              <img src="/logo2.svg" alt="Mathy Logo" className="h-8 w-auto" />
              <span className="ml-3 text-lg font-semibold text-gray-900">Dashboard</span>
            </Link>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              {userData?.avatar_url && (
                <img 
                  src={userData.avatar_url} 
                  alt={userData.name}
                  className="w-12 h-12 rounded-full border-2 border-gray-200"
                />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">{userData?.name || 'User'}</h3>
                <p className="text-sm text-gray-500">{userData?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'dashboard' ? 'bg-[#7A9CEB] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
                </svg>
                儀表板
              </button>
              
              <button
                onClick={() => setActiveTab('programs')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'programs' ? 'bg-[#7A9CEB] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                課程選擇
              </button>

              <button
                onClick={() => setActiveTab('practice')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'practice' ? 'bg-[#7A9CEB] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                練習題目
              </button>

              <button
                onClick={() => setActiveTab('progress')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'progress' ? 'bg-[#7A9CEB] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                學習進度
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'profile' ? 'bg-[#7A9CEB] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                個人檔案
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'settings' ? 'bg-[#7A9CEB] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                設定
              </button>
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link 
              href="/"
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回首頁
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Mathy Dashboard</h1>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  歡迎回來, {userData?.name}! 🎉
                </h1>
                <p className="text-gray-600 text-lg">
                  繼續您的數學學習之旅
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white hover:shadow-sm transition-all duration-300 rounded-xl overflow-hidden border-2 border-zinc-300 p-6">
                  <div className="text-center">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 mb-4 inline-block">
                      <svg className="w-8 h-8 text-[#7A9CEB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">今年解題數</h3>
                    <p className="text-3xl font-bold text-[#2B2B2B]">{activityStats.total_contributions}</p>
                  </div>
                </div>

                <div className="bg-white hover:shadow-sm transition-all duration-300 rounded-xl overflow-hidden border-2 border-zinc-300 p-6">
                  <div className="text-center">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 mb-4 inline-block">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">當前連續</h3>
                    <p className="text-3xl font-bold text-[#2B2B2B]">{activityStats.current_streak} 天</p>
                  </div>
                </div>

                <div className="bg-white hover:shadow-sm transition-all duration-300 rounded-xl overflow-hidden border-2 border-zinc-300 p-6">
                  <div className="text-center">
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 mb-4 inline-block">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">活躍天數</h3>
                    <p className="text-3xl font-bold text-[#2B2B2B]">{contributions.filter(c => c.count > 0).length}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white hover:shadow-sm transition-all duration-300 rounded-xl overflow-hidden border-2 border-zinc-300 p-8">
                <h2 className="text-2xl font-bold text-[#2B2B2B] mb-6">快速開始</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => setActiveTab('programs')}
                    className="group p-6 border-2 border-gray-200 rounded-xl hover:border-[#7A9CEB] hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
                        <svg className="w-6 h-6 text-[#7A9CEB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-bold text-[#2B2B2B] mb-2">選擇課程</h3>
                    <p className="text-gray-600 leading-relaxed">瀏覽所有可用的數學課程</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('practice')}
                    className="group p-6 border-2 border-gray-200 rounded-xl hover:border-[#7A9CEB] hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-300">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-bold text-[#2B2B2B] mb-2">開始練習</h3>
                    <p className="text-gray-600 leading-relaxed">繼續上次的練習進度</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Programs Tab */}
          {activeTab === 'programs' && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">數學課程</h1>
                <p className="text-gray-600 text-lg">選擇您想要學習的數學領域</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mathPrograms.map((program) => (
                  <div key={program.id} onClick={() => handleProgramSelect(program)}>
                    <ProgramCard
                      title={program.title}
                      description={program.description}
                      difficulty={program.difficulty}
                      difficultyColor={program.difficultyColor}
                      difficultyBgColor={program.difficultyBgColor}
                      level={program.level}
                      studentCount={program.studentCount}
                      imageSrc={program.imageSrc}
                      gradientFrom={program.gradientFrom}
                      gradientTo={program.gradientTo}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice Tab */}
          {activeTab === 'practice' && selectedProgram && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedProgram.title}</h1>
                    <p className="text-gray-600">{selectedProgram.description}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('programs')}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    返回課程選擇
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">練習題目</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedProgram.difficultyColor} ${selectedProgram.difficultyBgColor}`}>
                      {selectedProgram.questions[currentProblem].difficulty}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-6">
                    題目 {currentProblem + 1} / {selectedProgram.questions.length}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    {selectedProgram.questions[currentProblem].question}
                  </h3>
                  
                  <div className="space-y-3">
                    {selectedProgram.questions[currentProblem].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-[#7A9CEB] hover:bg-[#F8F9FA] transition-all font-medium"
                      >
                        <span className="inline-block w-8 h-8 bg-gray-100 rounded-full text-center leading-8 mr-4 text-sm">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>📝 這只是產品的一小部分預覽！</strong><br/>
                    完整版本將包含：詳細解題步驟、錯題分析、個人化建議等功能。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Practice Tab - No Program Selected */}
          {activeTab === 'practice' && !selectedProgram && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">選擇課程開始練習</h2>
                <p className="text-gray-600 mb-6">請先從課程選擇頁面選擇一個數學課程</p>
                <button
                  onClick={() => setActiveTab('programs')}
                  className="px-6 py-3 bg-[#7A9CEB] hover:bg-[#6B8CD9] text-white rounded-lg font-medium transition-colors"
                >
                  瀏覽課程
                </button>
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">學習進度</h1>
                <p className="text-gray-600 text-lg">追蹤您的學習表現和進度</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="text-center py-16">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">開始練習來查看進度</h2>
                  <p className="text-gray-600 mb-6">完成一些練習題目後，這裡會顯示您的學習進度和統計數據</p>
                  <button
                    onClick={() => setActiveTab('programs')}
                    className="px-6 py-3 bg-[#7A9CEB] hover:bg-[#6B8CD9] text-white rounded-lg font-medium transition-colors"
                  >
                    開始練習
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">個人檔案</h1>
                <p className="text-gray-600 text-lg">管理您的個人資訊和學習偏好</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">基本資訊</h2>
                  {userData && (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-6">
                        {userData.avatar_url && (
                          <img 
                            src={userData.avatar_url} 
                            alt={userData.name}
                            className="w-20 h-20 rounded-full border-4 border-gray-200"
                          />
                        )}
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{userData.name}</h3>
                          <p className="text-gray-600">{userData.email}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">數學興趣領域</h4>
                          <p className="text-gray-600">
                            {userData.math_interests && userData.math_interests.length > 0 
                              ? userData.math_interests.join(', ') 
                              : '尚未設定'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">當前程度</h4>
                          <p className="text-gray-600">{userData.current_level || '尚未設定'}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">學習時間</h4>
                          <p className="text-gray-600">{userData.study_time || '尚未設定'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Activity Overview Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">學習統計</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{activityStats.total_contributions}</div>
                      <div className="text-sm text-gray-600 mt-1">今年解題總數</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{activityStats.current_streak}</div>
                      <div className="text-sm text-gray-600 mt-1">當前連續天數</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{activityStats.longest_streak}</div>
                      <div className="text-sm text-gray-600 mt-1">最長連續記錄</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600">
                        {contributions.filter(c => c.count > 0).length}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">活躍天數</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contribution Table */}
              <div className="mt-8">
                <ContributionTable
                  contributions={contributions}
                  totalContributions={activityStats.total_contributions}
                  currentStreak={activityStats.current_streak}
                  longestStreak={activityStats.longest_streak}
                />
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">設定</h1>
                <p className="text-gray-600 text-lg">自訂您的學習體驗</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="text-center py-16">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">設定功能開發中</h2>
                  <p className="text-gray-600 mb-6">設定功能將在正式版本中提供，包括通知偏好、學習目標等自訂選項</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
