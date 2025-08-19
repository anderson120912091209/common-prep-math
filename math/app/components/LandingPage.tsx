'use client'

import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const rotatingWords = ["學測", "競賽", "IB", "AP"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Placeholder */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 font-bold text-lg">L</span>
            </div>
            <span className="ml-3 text-xl font-bold text-[#2B2B2B]">數學助手</span>
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
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              登入
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            {/* Left - Slogan */}
            <div className="lg:ml-12">
              <h1 className="text-5xl font-bold text-[#2B2B2B] mb-6">
                <span className="text-blue-400 transition-all duration-500 ease-in-out">
                  {rotatingWords[currentWordIndex]}
                </span>
                <span className="text-5xl font-bold text-[#2B2B2B] mb-6"> 數學，可以很簡單</span>
                <br />
              </h1>
              <p className="text-xl text-[#2B2B2B] mb-8">
                真實題庫、智能評分、個人化學習路徑
                <br />
                讓數學學習變得更有效率
              </p>
              <div className="flex items-center gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
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
      <section className="bg-white py-4 md:py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div 
              className="rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-lg relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #f1f3f8 0%, #e8f0fe 50%, #dce7f7 100%)'
              }}
            >
              {/* Math transparent image at corner - hidden on mobile */}
              <img 
                src="/math-transparent.png" 
                alt="Math elements" 
                className="absolute hidden md:block xl:left-130 xl:top-15 
                md:left-80 md:top-10 opacity-70 
                md:w-200 md:h-133 xl:w-200 xl:h-133"
              />
            {/* Inner container to control content size */}
            <div className="max-w-full md:max-w-3xl xl:max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 lg:gap-20 xl:gap-40 items-center relative z-10">
                {/* Left - Demo Image */}
                <div className="md:col-span-3 flex justify-center md:justify-start">
                  <div className="max-w-sm md:max-w-lg xl:max-w-2xl">
                    <img 
                      src="/demo3.png" 
                      alt="Math Question Demo" 
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* Right - Description */}
                <div className="md:col-span-2 space-y-3 md:space-y-4 text-center md:text-left">
                <h2 className="text-lg xl:text-3xl md:text-2xl font-bold text-[#2B2B2B]">
                  真實的考試體驗 
                </h2>
                <div className="space-y-2 xl:mt-10 md:mt-10"></div>
                <p className="text-xs md:text-base text-[#2B2B2B] font-bold">
                  我們的平台提供完全仿真的數學考試環境，讓您在熟悉的介面中練習，提升考試表現。
                </p>

                <div className="pt-1 md:pt-2 text-center md:text-left">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 md:px-5 md:py-2 rounded-lg font-medium transition-colors text-xs md:text-sm">
                    立即體驗
                  </button>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
