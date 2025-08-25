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

      {/* Mission Statement */}
      <div className="flex items-center justify-center py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] mb-8 text-center">
            Our Mission
          </h1>
          <div className="text-left">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              We started out as an Elite STEM tutoring group based in Taiwan, Singapore and Malaysia.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              We have been helping students in Singapore, Malaysia and Taiwan to excel in their exams for the past 10 years.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              We have seen many students struggle with math, and we want to help them overcome their fear of math.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              We believe that math should be fun and easy to learn, and we want to make it accessible to everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#7A9CEB] mb-4">Mathy</h3>
              <p className="text-gray-600 mb-6">
                讓數學學習變得直觀、有趣且高效。
              </p>
              <div className="flex justify-center space-x-6 text-sm text-gray-500">
                <span>&copy; 2024 Mathy. 保留所有權利。</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
