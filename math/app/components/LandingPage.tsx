'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import DemoSection from './DemoSection';
import { AdminAccessWidget } from '../../components/TeacherLoginButton';
import { UserAvatar } from '../../components/UserAvatar';
import { useRouter } from 'next/navigation';
import MathQuestion from './MathQuestion';
import AnswerBox from './math/answer-box'
import LeaderboardDashboard from './Leaderboard-Dashboard'
import SuperFastInputMethod from './SuperFastInputMethod'
import MathProgressTracker from './MathProgressTracker'
import ProgramCard from './ProgramCard'
import { supabase } from '../../lib/supabase';

export default function LandingPage() {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // User authentication state
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Animation states for different sections
  const [animateDemo, setAnimateDemo] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const [animatePrograms, setAnimatePrograms] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  
  // Refs for intersection observer
  const demoRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const programsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const rotatingWords = ["任何", "學測", "國中", "競賽", "微積分", "統計", "幾何"];
  
  useEffect(() => {
    // Trigger initial load animation
    setIsLoaded(true);
    
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Check user authentication
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (user && !error) {
          setUser(user);
          
          // Get user data from waitlist table
          const { data: waitlistUser } = await supabase
            .from('waitlist')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (waitlistUser) {
            setUserData(waitlistUser);
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoadingAuth(false);
      }
    };

    checkUser();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targetId = entry.target.getAttribute('data-section');
          switch (targetId) {
            case 'demo':
              setAnimateDemo(true);
              break;
            case 'cards':
              setAnimateCards(true);
              break;
            case 'programs':
              setAnimatePrograms(true);
              break;
            case 'progress':
              setAnimateProgress(true);
              break;
          }
        }
      });
    }, observerOptions);

    // Observe all sections
    if (demoRef.current) observer.observe(demoRef.current);
    if (cardsRef.current) observer.observe(cardsRef.current);
    if (programsRef.current) observer.observe(programsRef.current);
    if (progressRef.current) observer.observe(progressRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-[#7A9CEB]">
            <img src="/logo2.svg" alt="Mathy" className="w-90 sm:w-90 md:w-80 lg:w-90 h-10 sm:h-10 md:h-10 lg:h-10" />
          </Link>
          <div className="hidden sm:flex items-center gap-4 md:gap-6">
            <Link href="/" className="text-sm md:text-base text-gray-600 hover:text-[#7A9CEB] transition-colors duration-150 cursor-pointer">
              首頁
            </Link>
            
            {/* Features Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center text-sm md:text-base text-gray-600 hover:text-[#7A9CEB] transition-colors duration-150 cursor-pointer"
                onClick={() => setActiveDropdown(activeDropdown === 'features' ? null : 'features')}
              >
                功能特色
                <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'features' && (
                <div className="absolute top-full left-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-md border border-gray-100 py-2 z-50">
                  <a href="#" className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-[#7A9CEB] transition-colors duration-150">
                    真實題庫
                  </a>
                  <a href="#" className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-[#7A9CEB] transition-colors duration-150">
                    AI 智能評分
                  </a>
                  <a href="#" className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-[#7A9CEB] transition-colors duration-150">
                    詳細解答
                  </a>
                </div>
              )}
            </div>

            {/* Courses Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center text-sm md:text-base text-gray-600 hover:text-[#7A9CEB] transition-colors duration-150 cursor-pointer"
                onClick={() => setActiveDropdown(activeDropdown === 'courses' ? null : 'courses')}
              >
                課程內容
                <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'courses' && (
                <div className="absolute top-full left-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-md border border-gray-100 py-2 z-50">
                  <a href="#" className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-[#7A9CEB] transition-colors duration-150">
                    數學 A
                  </a>
                  <a href="#" className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-[#7A9CEB] transition-colors duration-150">
                    數學 B
                  </a>
                  <a href="#" className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-[#7A9CEB] transition-colors duration-150">
                    模擬考試
                  </a>
                </div>
              )}
            </div>

            <Link href="/about" className="text-sm md:text-base text-gray-600 hover:text-[#7A9CEB] transition-colors duration-150 cursor-pointer">
              關於我們
            </Link>
            
            {/* User Authentication Section */}
            {!loadingAuth && (
              <>
                {user && userData ? (
                  /* Signed-in user UI */
                  <div className="flex items-center gap-3">
                    <Link 
                      href="/product/testing" 
                      className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors"
                    >
                      🚀 測試產品
                    </Link>
                    <UserAvatar size="md" />
                  </div>
                ) : (
                  /* Non-signed-in user UI */
                  <Link href="/waitlist" className="bg-[#7A9CEB] hover:bg-[#6B8CD9] text-white px-3 sm:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors">
                    加入等待名單
                  </Link>
                )}
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="sm:hidden p-2 text-gray-600 hover:text-[#7A9CEB] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
            <div className="px-4 py-3 space-y-3">
              <Link 
                href="/" 
                className="block text-gray-600 hover:text-[#7A9CEB] transition-colors duration-150 cursor-pointer py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                首頁
              </Link>
              
              {/* Mobile Features Section */}
              <div className="border-t border-gray-100 pt-3">
                <div className="text-sm font-medium text-gray-900 mb-2">功能特色</div>
                <div className="pl-4 space-y-2">
                  <a href="#" className="block text-sm text-gray-600 hover:text-[#7A9CEB] transition-colors duration-150 py-1">
                    真實題庫
                  </a>
                  <a href="#" className="block text-sm text-gray-600 hover:text-[#7A9CEB] transition-colors duration-150 py-1">
                    AI 智能評分
                  </a>
                  <a href="#" className="block text-sm text-gray-600 hover:text-[#7A9CEB] transition-colors duration-150 py-1">
                    詳細解答
                  </a>
                </div>
              </div>
              
              {/* Mobile Courses Section */}
              <div className="border-t border-gray-100 pt-3">
                <div className="text-sm font-medium text-gray-900 mb-2">課程內容</div>
                <div className="pl-4 space-y-2">
                  <a href="#" className="block text-sm text-gray-600 hover:text-[#7A9CEB] transition-colors duration-150 py-1">
                    數學 A
                  </a>
                  <a href="#" className="block text-sm text-gray-600 hover:text-[#7A9CEB] transition-colors duration-150 py-1">
                    數學 B
                  </a>
                  <a href="#" className="block text-sm text-gray-600 hover:text-[#7A9CEB] transition-colors duration-150 py-1">
                    模擬考試
                  </a>
                </div>
              </div>
              
              <Link 
                href="/about" 
                className="block text-gray-600 hover:text-[#7A9CEB] transition-colors duration-150 cursor-pointer py-2 border-t border-gray-100 pt-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                關於我們
              </Link>
              
              {/* Mobile User Authentication Section */}
              {!loadingAuth && (
                <>
                  {user && userData ? (
                    /* Mobile Signed-in user UI */
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-3 mb-3">
                        {user.user_metadata?.avatar_url && (
                          <img 
                            src={user.user_metadata.avatar_url} 
                            alt={userData.name || user.user_metadata?.name || 'User'}
                            className="w-8 h-8 rounded-full border-2 border-gray-200"
                          />
                        )}
                        <span className="text-sm text-gray-700 font-medium">
                          {userData.name || user.user_metadata?.name || 'User'}
                        </span>
                      </div>
                      <Link 
                        href="/product/testing" 
                        className="block bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        🚀 測試產品
                      </Link>
                    </div>
                  ) : (
                    /* Mobile Non-signed-in user UI */
                    <Link 
                      href="/waitlist" 
                      className="block bg-[#7A9CEB] hover:bg-[#6B8CD9] text-white px-4 py-3 rounded-lg font-medium transition-colors text-center mt-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      加入等待名單
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            {/* Left - Slogan */}
            <div className="lg:ml-12">
                             {/* YC Badge */}
               <div className={`flex items-center justify-between gap-x-4 border-2 border-gray-300 p-2 text-sm font-medium text-[#2B2B2B] backdrop-blur-lg transition-all duration-1000 ease-out rounded-full h-[53px] min-w-[200px] w-fit mb-4 transform ${
                 isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
               }`}>
                 <span className="flex items-center justify-center rounded-full bg-[#7A9CEB] px-3 py-1 text-center text-white">
                   最新消息
                 </span>
                 <a href="/waitlist" className="flex items-center font truncate underline-offset-2 transition-all">
                   Beta 測試版本將由 9/20 發行，加入測試名單
                   <svg className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                 </a>
               </div>
               
               <h1 className={`text-5xl font-bold text-[#2B2B2B] mb-6 transition-all duration-1000 ease-out delay-200 transform ${
                 isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
               }`}>
                 <span className="text-[#7A9CEB] transition-all duration-500 ease-in-out">
                   {rotatingWords[currentWordIndex]}
                 </span>
                 <span className="text-5xl font-bold text-[#2B2B2B] mb-6"> 數學，可以很簡單</span>
                 <br />
               </h1>
               <p className={`text-xl text-[#2B2B2B] mb-8 transition-all duration-1000 ease-out delay-400 transform ${
                 isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
               }`}>
                 真實題庫、智能評分、個人化學習路徑，刺激競賽
                 <br />
                 讓數學變的無比簡單
               </p>
                                             <div className={`flex items-center gap-4 transition-all duration-1000 ease-out delay-600 transform ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <button 
                    onClick={() => router.push('/waitlist')}
                    className="bg-[#7A9CEB] hover:bg-[#6B8CD9] text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                  >
                    立即開始
                  </button>
                  <button className="border border-gray-300 hover:border-gray-400 text-[#2B2B2B] px-8 py-3 rounded-lg text-lg font-medium transition-colors">
                    了解更多
                  </button>
                </div>
            </div>

            {/* Right - Image */}
            <div className="flex justify-center">
              <div className="w-[500px] h-[500px] rounded-2xl overflow-hidden">
                <img 
                  src="/animals.png" 
                  alt="Animals illustration" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <div 
        ref={demoRef}
        data-section="demo"
        className={`transition-all duration-1000 ease-out ${
          animateDemo 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
      <DemoSection
        title="真實的考試體驗"
        description="我們的平台提供完全仿真的數學考試環境，讓您在熟悉的介面中練習，提升考試表現。"
        imageSrc="/demo3.png"
        imageAlt="Math Question Demo"
        buttonText="開始練習"
        backgroundImageSrc=""
        backgroundImageAlt="Math elements"
        onButtonClick={() => {
          // Handle button click
          console.log('Demo section button clicked');
        }}
      />
      </div>

      {/* Split Screen Section */}
      <section 
        ref={cardsRef}
        data-section="cards"
        className={`relative mt-24 flex w-full max-w-7xl flex-col gap-6 px-6 md:flex-row md:px-12 mx-auto transition-all duration-1000 ease-out ${
          animateCards 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Left Panel */}
        <div className="md:w-1/3">
          <div className="sticky left-1/2 top-1/2">
            <h2 className="font-bold text-[#2B2B2B] text-4xl 
            text-center md:text-4xl leading-tight">
              透過有趣，刺激的競賽
              <br />
              <span className="font-bold text-[#2B2B2B] text-4xl">學習</span>
              <span className="text-[#6B8CD9]">任何等級</span>
              <span className="font-bold text-[#2B2B2B] text-4xl">的數學</span>
            </h2>
          </div>
        </div>

        {/* Right Panel */}
        <div className="mt-6 flex w-full flex-col gap-6 md:mt-0 md:w-2/3 md:gap-12">
          {/* First Card */}
          <div className="relative flex h-[360px] w-full max-w-2xl flex-col items-center justify-center place-self-end overflow-visible rounded-2xl sm:h-[400px] md:h-[480px]">
            <img 
              src="/card-1-demo.png" 
              alt="Competition challenge demo" 
              className="w-full h-auto object-contain"
            />
            
            {/* Rabbit in Motion - Bottom Right Corner */}
            <div className="absolute bottom-4 -right-20 z-50">
              <img 
                src="/rabbit-in-motion.png" 
                alt="Rabbit character in motion" 
                className="w-32 h-32 md:w-40 md:h-40 lg:w-48 scale-110 lg:h-48"
              />
            </div>
          </div>

          {/* Second Card */}
          <div className="relative flex h-[260px] w-full max-w-2xl 
          flex-col items-center justify-center place-self-end overflow-visible 
          rounded-2xl sm:h-[260px] md:h-[360px]">
            <SuperFastInputMethod className="w-full h-full" />
          </div>

          {/* Third Card */}
          <div className="relative flex h-[360px] w-full max-w-2xl flex-col items-center justify-center place-self-end overflow-visible rounded-2xl sm:h-[400px] md:h-[480px]">
            <img 
              src="/demo-card-3.png" 
              alt="Real-time ranking demo" 
              className="w-full h-auto object-contain"
            />
            
            {/* Capybara - Bottom Right Corner */}
            <div className="absolute bottom-20 -right-27 z-50">
              <img 
                src="/capybara-hi-guitar.png" 
                alt="Capybara character" 
                className="w-32 h-32 md:w-40 md:h-40 lg:w-48 scale-90 lg:h-48"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mathematics Programs Section */}
      <section 
        ref={programsRef}
        data-section="programs"
        className={`mt-24 py-16 transition-all duration-1000 ease-out ${
          animatePrograms 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] mb-6">
              任何等級的數學，我們都有
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              我們提供多樣化的數學課程，從基礎到進階，讓您根據自己的需求選擇最適合的學習路徑。
            </p>
            
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProgramCard
              title="學測｜數學A"
              description="大學學測數學A，涵蓋代數、幾何、統計等核心概念，適合理工科系考生。"
              difficulty="中等"
              difficultyColor="text-green-600"
              difficultyBgColor="bg-green-100"
              level="適合高中程度"
              studentCount="2,847"
              imageSrc="/asian-kid-studying.png"
              gradientFrom="blue-400"
              gradientTo="blue-600"
            />
            
            <ProgramCard
              title="學測｜數學B"
              description="大學學測數學B，專注於統計與機率，適合商管、社會科學等科系考生。"
              difficulty="基礎"
              difficultyColor="text-blue-600"
              difficultyBgColor="bg-blue-100"
              level="適合高中程度"
              studentCount="1,923"
              imageSrc="/asian-kid-studying.png"
              gradientFrom="green-400"
              gradientTo="green-600"
            />
            
            <ProgramCard
              title="考研｜微積分"
              description="大學微積分課程，包含極限、導數、積分等核心概念，適合理工科系學生。"
              difficulty="進階"
              difficultyColor="text-orange-600"
              difficultyBgColor="bg-orange-100"
              level="適合大學程度"
              studentCount="3,456"
              imageSrc="/calcimage.png"
              gradientFrom="purple-400"
              gradientTo="purple-600"
            />
            
            <ProgramCard
              title="大學｜統計學"
              description="統計學基礎課程，涵蓋描述統計、推論統計、機率論等實用概念。"
              difficulty="中等"
              difficultyColor="text-green-600"
              difficultyBgColor="bg-green-100"
              level="適合大學程度"
              studentCount="2,134"
              imageSrc="/statistics2.png"
              gradientFrom="orange-400"
              gradientTo="orange-600"
            />
            
            <ProgramCard
              title="大學｜線性代數"
              description="線性代數基礎課程，包含向量、矩陣、特徵值等核心概念。"
              difficulty="進階"
              difficultyColor="text-orange-600"
              difficultyBgColor="bg-orange-100"
              level="適合大學程度"
              studentCount="1,876"
              imageSrc="/linear-algebra.png"
              gradientFrom="red-400"
              gradientTo="red-600"
            />
            
            <ProgramCard
              title="競賽數學｜AMC"
              description="數學競賽專項訓練，包含奧林匹克數學、AMC等競賽題型解析。"
              difficulty="專家"
              difficultyColor="text-red-600"
              difficultyBgColor="bg-red-100"
              level="適合競賽程度"
              studentCount="956"
              imageSrc="/competitions.png"
              gradientFrom="yellow-400"
              gradientTo="yellow-600"
            />
          </div>
          <div className="flex justify-center">
            <h2 className="text-xl 
            justify-center font-medium text-zinc-600 mb-6 mt-6">
              以及更多更多學習主題...
            </h2>
          </div>
        </div>
      </section>

      {/* Progress Tracker Section */}
      <section 
        ref={progressRef}
        data-section="progress"
        className={`py-16 bg-white transition-all duration-1000 ease-out ${
          animateProgress 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2B2B2B] mb-6">
              追蹤你的學習進度
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              像 GitHub 追蹤程式碼貢獻一樣，我們追蹤你的數學練習進度。每天解決問題，建立你的學習熱度圖！
            </p>
          </div>
          
          <div className="flex justify-center">
            <MathProgressTracker className="max-w-4xl" />
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              堅持每天練習，讓數學成為你的強項
            </p>
            <button className="bg-[#7A9CEB] hover:bg-[#6B8CD9] text-white px-8 py-3 rounded-lg font-medium transition-colors">
              開始追蹤進度
            </button>
          </div>
        </div>
      </section>

      {/* Get Started Footer */}
      <section className="mt-24 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
                    <div className="bg-cover bg-center bg-no-repeat rounded-2xl p-40 
           md:p-40" style={{ backgroundImage: 'url(/lavender-small-1.png)' }}>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                準備好開始你的數學之旅了嗎？
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                加入我們，與數千名學生一起，在有趣的挑戰中提升數學能力
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
              {/* Animal Groups Image */}
              <div className="max-w-sm -mt-4">
                <div className="w-full h-40"></div>
              </div>

              {/* CTA Content */}
              <div className="text-left max-w-md">
                <div className="space-y-6">

                           <div className="flex flex-col sm:flex-row gap-4 justify-start items-center">
                      <button 
                        onClick={() => router.push('/waitlist')}
                        className="bg-white 
                        border border-white
                        text-[#7A9CEB] px-4 border border-white py-2 rounded-lg font-medium 
                        transition-colors w-full sm:w-auto flex items-center gap-2"
                      >
                        <img 
                          src="/reverse-logo1.png" 
                          alt="Mathy Logo" 
                          className="w-8 h-8"
                        />
                        加入等待名單
                      </button>
                      <button className="border border-white 
                      text-white hover:bg-white hover:text-[#7A9CEB] 
                      backdrop-blur-md bg-white/10 px-8 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto">
                       了解更多
                      </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
     
      {/* Admin Access Widget for logged-in admins */}
      <AdminAccessWidget />
    
    </div>
  );
}
