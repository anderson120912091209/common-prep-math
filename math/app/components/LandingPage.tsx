'use client'

import { useState, useEffect } from 'react';
import DemoSection from './DemoSection';

export default function LandingPage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const rotatingWords = ["學測", "國中", "競賽", "微積分", "統計", "幾何"];
  
  useEffect(() => {
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
            <img src="/logo1.svg" alt="Mathy Logo" className="h-10 w-auto" />
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
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            {/* Left - Slogan */}
            <div className="lg:ml-12">
              <h1 className="text-5xl font-bold text-[#2B2B2B] mb-6">
                <span className="text-[#7A9CEB] transition-all duration-500 ease-in-out">
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
                <button className="bg-[#7A9CEB] hover:bg-[#6B8CD9] text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
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
        buttonText="立即體驗"
        backgroundImageSrc=""
        backgroundImageAlt="Math elements"
        onButtonClick={() => {
          // Handle button click
          console.log('Demo section button clicked');
        }}
      />
      <DemoSection
        title="有趣，刺激的競賽"
        description="我們的平台提供完全仿真的數學考試環境，讓您在熟悉的介面中練習，提升考試表現。"
        imageSrc="/demo3.png"
        imageAlt="Math Question Demo"
        buttonText="立即體驗"
        backgroundImageSrc=""
        backgroundImageAlt="Math elements"
        onButtonClick={() => {
          // Handle button click
          console.log('Demo section button clicked');
        }}
      />
    </div>
  );
}
