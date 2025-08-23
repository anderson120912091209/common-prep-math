'use client'

import { useState, useEffect } from 'react';
import DemoSection from './DemoSection';
import { useRouter } from 'next/navigation';
import MathQuestion from './MathQuestion';
import AnswerBox from './math/answer-box'
import LeaderboardDashboard from './Leaderboard-Dashboard'
import SuperFastInputMethod from './SuperFastInputMethod'

export default function LandingPage() {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const rotatingWords = ["學測", "國中", "競賽", "微積分", "統計", "幾何"];
  
  useEffect(() => {
    // Trigger initial load animation
    setIsLoaded(true);
    
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto px-20 relative flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo2.svg" alt="Mathy Logo" className="h-10 w-auto" />
          </div>

          {/* Middle Navigation */}
          <div className="flex items-center space-x-8">
            {/* Features Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center text-gray-700 hover:text-[#2B2B2B] hover:bg-gray-100 rounded-full px-3 py-2 font-medium transition-colors"
                onClick={() => setActiveDropdown(activeDropdown === 'features' ? null : 'features')}
              >
                功能特色
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'features' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">真實題庫</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">AI 智能評分</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">詳細解答</a>
                </div>
              )}
            </div>

            {/* Courses Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center text-gray-700 hover:text-[#2B2B2B] hover:bg-gray-100 rounded-full px-3 py-2 font-medium transition-colors"
                onClick={() => setActiveDropdown(activeDropdown === 'courses' ? null : 'courses')}
              >
                課程內容
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'courses' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">數學 A</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">數學 B</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">模擬考試</a>
                </div>
              )}
            </div>

            <a href="#" className="text-gray-700 hover:text-[#2B2B2B] hover:bg-gray-100 rounded-full px-3 py-2 font-medium transition-colors">學習支援</a>
            <a href="/about" className="text-gray-700 hover:text-[#2B2B2B] hover:bg-gray-100 rounded-full px-3 py-2 font-medium transition-colors">關於我們</a>
          </div>

          {/* Sign In Button */}
          <div className="flex items-center gap-2">
            <button className="bg-[#7A9CEB] hover:bg-[#6B8CD9] text-white px-6 py-2 rounded-lg font-medium transition-colors">
              登入
            </button>
          </div>
        </div>
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
                 <a href="#" className="flex items-center font truncate underline-offset-2 transition-all">
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

      {/* Split Screen Section */}
      <section className="relative mt-24 flex w-full max-w-7xl flex-col gap-6 px-6 md:flex-row md:px-12 mx-auto">
        {/* Left Panel */}
        <div className="md:w-1/3">
          <div className="sticky left-1/2 top-1/2">
            <h2 className="font-bold text-[#2B2B2B] text-3xl md:text-4xl leading-tight">
              透過有趣，刺激的競賽學習任何等級的數學
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
            <div className="absolute bottom-4 -right-25 z-50">
              <img 
                src="/rabbit-in-motion.png" 
                alt="Rabbit character in motion" 
                className="w-32 h-32 md:w-40 md:h-40 lg:w-48 scale-120 lg:h-48"
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
      <section className="mt-24 py-16">
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
            {/* 學測A */}
            <div className="bg-white hover:bg-zinc-100 transition-all duration-200 
            rounded-xl border-4 border-zinc-300 p-6 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#7A9CEB] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <h3 className="text-[#2B2B2B] font-bold text-xl">學測A</h3>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#7A9CEB] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                大學學測數學A，涵蓋代數、幾何、統計等核心概念，適合理工科系考生。
              </p>
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>2,847 學生</span>
                </div>
                <span className="text-[#7A9CEB]">Mathy Official</span>
              </div>
            </div>

            {/* 學測B */}
            <div className="bg-white hover:bg-zinc-100 transition-all duration-200 
            rounded-xl border-4 border-zinc-300 p-6 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">B</span>
                  </div>
                  <h3 className="text-[#2B2B2B] font-bold text-xl">學測B</h3>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#7A9CEB] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                大學學測數學B，專注於統計與機率，適合商管、社會科學等科系考生。
              </p>
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>1,923 學生</span>
                </div>
                <span className="text-[#7A9CEB]">Mathy Official</span>
              </div>
            </div>

            {/* 微積分 */}
            <div className="bg-white hover:bg-zinc-100 transition-all duration-200 
            rounded-xl border-4 border-zinc-300 p-6 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-[#2B2B2B] font-bold text-xl">微積分</h3>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#7A9CEB] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                大學微積分課程，包含極限、導數、積分等核心概念，適合理工科系學生。
              </p>
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>3,456 學生</span>
                </div>
                <span className="text-[#7A9CEB]">Mathy Official</span>
              </div>
            </div>

            {/* 統計學 */}
            <div className="bg-white hover:bg-zinc-100 transition-all duration-200 
            rounded-xl border-4 border-zinc-300 p-6 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-[#2B2B2B] font-bold text-xl">統計學</h3>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#7A9CEB] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                統計學基礎課程，涵蓋描述統計、推論統計、機率論等實用概念。
              </p>
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>2,134 學生</span>
                </div>
                <span className="text-[#7A9CEB]">Mathy Official</span>
              </div>
            </div>

            {/* 線性代數 */}
            <div className="bg-white hover:bg-zinc-100 transition-all duration-200 
            rounded-xl border-4 border-zinc-300 p-6 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                  <h3 className="text-[#2B2B2B] font-bold text-xl">線性代數</h3>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#7A9CEB] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                線性代數基礎課程，包含向量、矩陣、特徵值等核心概念。
              </p>
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>1,876 學生</span>
                </div>
                <span className="text-[#7A9CEB]">Mathy Official</span>
              </div>
            </div>

            {/* 競賽數學 */}
            <div className="bg-white hover:bg-zinc-100 transition-all duration-200 
            rounded-xl border-4 border-zinc-300 p-6 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-[#2B2B2B] font-bold text-xl">競賽數學</h3>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#7A9CEB] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                數學競賽專項訓練，包含奧林匹克數學、AMC等競賽題型解析。
              </p>
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>956 學生</span>
                </div>
                <span className="text-[#7A9CEB]">Mathy Official</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Footer */}
      <section className="mt-24 py-16 bg-[#7A9CEB] overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              準備好開始你的數學之旅了嗎？
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              加入我們的學習社群，與這些可愛的夥伴一起探索數學的奧秘
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Animal Groups Image */}
            <div className="max-w-md">
              <img 
                src="/animals-group.png" 
                alt="Friendly animal characters ready to learn" 
                className="w-full h-auto scale-120"
              />
            </div>

            {/* CTA Content */}
            <div className="text-center max-w-md">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">
                  立即加入，開始學習
                </h3>
                <p className="text-white/90">
                  與數千名學生一起，在有趣的競賽中提升數學能力。
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => router.push('/waitlist')}
                    className="bg-white text-[#7A9CEB] hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    免費開始
                  </button>
                  <button className="border border-white text-white hover:bg-white hover:text-[#7A9CEB] px-8 py-3 rounded-lg font-medium transition-colors">
                    了解更多
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    
    </div>
  );
}
