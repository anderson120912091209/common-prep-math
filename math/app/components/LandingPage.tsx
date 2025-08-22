'use client'

import { useState, useEffect } from 'react';
import DemoSection from './DemoSection';
import LeaderboardPreview from './LeaderboardPreview';
import { useRouter } from 'next/navigation';
import MathQuestion from './MathQuestion';
import AnswerBox from './math/answer-box'
import LeaderboardDashboard from './Leaderboard-Dashboard'

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
            <a href="#" className="text-gray-700 hover:text-[#2B2B2B] hover:bg-gray-100 rounded-full px-3 py-2 font-medium transition-colors">關於我們</a>
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
          <div className="relative flex h-[360px] w-full max-w-2xl flex-col items-center justify-center place-self-end overflow-hidden rounded-2xl sm:h-[400px] md:h-[480px]">
            <img 
              src="/demo-card-1.png" 
              alt="Competition challenge demo" 
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Second Card */}
          <div className="relative flex h-[360px] w-full max-w-2xl flex-col items-center justify-center place-self-end overflow-hidden rounded-2xl sm:h-[400px] md:h-[480px]">
            <img 
              src="/demo-card-2.png" 
              alt="Super fast input method demo" 
              className="w-full h-auto object-contain"
            />
            {/* AnswerBox positioned over the white input area */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-md">
              <AnswerBox className="bg-white border-2 border-gray-300 shadow-lg" showSampleQuestion={false} />
            </div>
          </div>

          {/* Third Card */}
          <div className="relative flex h-[360px] w-full max-w-2xl flex-col items-center justify-start gap-3 place-self-end overflow-hidden rounded-2xl bg-gray-900 p-6 text-center text-white sm:h-[400px] md:h-[480px] md:p-12">
            <h3 className="text-xl md:text-2xl font-bold mb-4">即時排名</h3>
            <p className="text-sm md:text-base leading-relaxed">
              完成挑戰獲得積分和徽章，建立成就感，讓學習變得更有趣。
            </p>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <LeaderboardDashboard />

      {/* Get Started Footer */}
      <section className="mt-24 py-16 bg-[#7A9CEB]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              準備好開始你的數學之e旅了嗎？
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
