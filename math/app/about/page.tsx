import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm px-6 py-4 border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#7A9CEB]">
            <img src="/logo2.svg" alt="Mathy" className="w-90 h-10" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-[#7A9CEB] transition-colors">
              首頁
            </Link>
            <Link href="/about" className="text-[#7A9CEB] font-medium">
              關於我們
            </Link>
            <Link href="/waitlist" className="bg-[#7A9CEB] hover:bg-[#6B8CD9] text-white px-4 py-2 rounded-lg font-medium transition-colors">
              加入等待名單
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-[#2B2B2B] mb-6">
              關於我們
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              我們致力於讓數學學習變得更加直觀、有趣且高效。透過創新的技術和教學方法，我們希望幫助每一位學生愛上數學。
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#2B2B2B] mb-6">
                我們的使命
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                在 Mathy，我們相信每個人都能掌握數學。我們的使命是打破傳統數學學習的障礙，創造一個讓學生能夠直觀理解複雜數學概念的平台。
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                透過結合先進的技術和經過驗證的教學方法，我們提供個人化的學習體驗，讓數學不再是令人恐懼的學科，而是充滿樂趣的探索之旅。
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#7A9CEB] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#2B2B2B]">創新學習</h3>
                  <p className="text-sm text-gray-600">結合技術與教育的最佳實踐</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#7A9CEB]/10 to-[#6B8CD9]/10 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-10 h-10 bg-[#7A9CEB] rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-[#2B2B2B] mb-2">直觀輸入</h3>
                  <p className="text-sm text-gray-600">比 LaTeX 更簡單的數學公式輸入方式</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-10 h-10 bg-[#7A9CEB] rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-[#2B2B2B] mb-2">即時反饋</h3>
                  <p className="text-sm text-gray-600">立即看到你的數學表達式</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-10 h-10 bg-[#7A9CEB] rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-[#2B2B2B] mb-2">智能學習</h3>
                  <p className="text-sm text-gray-600">AI 輔助的個人化學習路徑</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-10 h-10 bg-[#7A9CEB] rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="font-semibold text-[#2B2B2B] mb-2">社群互動</h3>
                  <p className="text-sm text-gray-600">與其他學習者分享和交流</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2B2B2B] mb-6">
              我們的團隊
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              由數學教育專家、軟體工程師和設計師組成的專業團隊，致力於創造最佳的數學學習體驗。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-[#7A9CEB] to-[#6B8CD9] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">陳</span>
              </div>
              <h3 className="text-xl font-semibold text-[#2B2B2B] text-center mb-2">陳博士</h3>
              <p className="text-[#7A9CEB] text-center mb-4">創始人 & CEO</p>
              <p className="text-gray-600 text-center text-sm">
                數學教育博士，擁有15年教學經驗，專注於創新教學方法和技術整合。
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-[#7A9CEB] to-[#6B8CD9] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">李</span>
              </div>
              <h3 className="text-xl font-semibold text-[#2B2B2B] text-center mb-2">李工程師</h3>
              <p className="text-[#7A9CEB] text-center mb-4">技術總監</p>
              <p className="text-gray-600 text-center text-sm">
                資深軟體工程師，專精於教育科技和用戶體驗設計，致力於創造直觀的學習工具。
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-[#7A9CEB] to-[#6B8CD9] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">王</span>
              </div>
              <h3 className="text-xl font-semibold text-[#2B2B2B] text-center mb-2">王老師</h3>
              <p className="text-[#7A9CEB] text-center mb-4">教育總監</p>
              <p className="text-gray-600 text-center text-sm">
                資深數學教師，擁有豐富的課程設計經驗，專注於讓複雜概念變得簡單易懂。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2B2B2B] mb-6">
              我們的價值觀
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              這些核心價值觀指導著我們的每一個決策和行動。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#7A9CEB] rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4">教育為本</h3>
              <p className="text-gray-600">
                我們相信教育的力量，致力於為每一位學生提供高品質的學習體驗。
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#7A9CEB] rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4">創新驅動</h3>
              <p className="text-gray-600">
                持續探索新的技術和方法，為數學教育帶來革命性的改變。
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#7A9CEB] rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4">以人為本</h3>
              <p className="text-gray-600">
                將學生的需求和體驗放在首位，創造真正有價值的學習工具。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#7A9CEB]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            準備好開始你的數學學習之旅了嗎？
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            加入我們的等待名單，成為第一批體驗革命性數學學習平台的用戶。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/waitlist" 
              className="bg-white text-[#7A9CEB] hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              加入等待名單
            </Link>
            <Link 
              href="/" 
              className="border border-white text-white hover:bg-white hover:text-[#7A9CEB] px-8 py-3 rounded-lg font-medium transition-colors"
            >
              回到首頁
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2B2B2B] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-[#7A9CEB] mb-4">Mathy</h3>
              <p className="text-gray-400">
                讓數學學習變得直觀、有趣且高效。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">產品</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">首頁</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">關於我們</Link></li>
                <li><Link href="/waitlist" className="hover:text-white transition-colors">等待名單</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">支援</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">使用指南</a></li>
                <li><a href="#" className="hover:text-white transition-colors">常見問題</a></li>
                <li><a href="#" className="hover:text-white transition-colors">聯絡我們</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">社群</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Mathy. 保留所有權利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
