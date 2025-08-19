'use client'

import { useState } from 'react';

export default function LandingPage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
            <span className="ml-3 text-xl font-bold text-gray-900">數學助手</span>
          </div>

          {/* Middle Navigation */}
          <div className="flex items-center space-x-8">
            {/* Features Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center text-gray-700 hover:text-gray-900 font-medium"
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
                className="flex items-center text-gray-700 hover:text-gray-900 font-medium"
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

            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">學習支援</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">關於我們</a>
          </div>

          {/* Sign In Button */}
          <div className="flex items-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              登入
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Slogan */}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                掌握數學
                <br />
                <span className="text-blue-600">成就未來</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                真實題庫、智能評分、個人化學習路徑
                <br />
                讓數學學習變得更有效率
              </p>
              <div className="flex items-center gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
                  立即開始
                </button>
                <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium transition-colors">
                  了解更多
                </button>
              </div>
            </div>

            {/* Right - Image Placeholder */}
            <div className="flex justify-center">
              <div className="w-96 h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-blue-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-blue-600 font-medium">圖片佔位符</p>
                  <p className="text-sm text-blue-500">將來放置您的圖片</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-blue-50 rounded-3xl p-12 shadow-lg">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-center">
              {/* Left - Demo Image */}
              <div className="xl:col-span-3 flex justify-center">
                <img 
                  src="/demo3.png" 
                  alt="Math Question Demo" 
                  className="w-full max-w-4xl h-auto"
                />
              </div>

              {/* Right - Description */}
              <div className="xl:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  真實考試體驗
                </h2>
                <p className="text-base text-gray-700">
                  我們的平台提供完全仿真的數學考試環境，讓您在熟悉的介面中練習，提升考試表現。
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">真實題庫</h3>
                      <p className="text-gray-600 text-sm">來自歷年考試的真實題目</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">智能評分</h3>
                      <p className="text-gray-600 text-sm">AI 驅動的評分系統</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">互動功能</h3>
                      <p className="text-gray-600 text-sm">數學符號輸入、圖形繪製工具</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm">
                    立即體驗
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
