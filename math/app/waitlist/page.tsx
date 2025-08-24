'use client'

import { useState } from 'react';
import Link from 'next/link';
import SupabaseForm from '../components/waitlist-ui/waitlist-form';   

export default function WaitlistPage() {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const handleSubmit = () => {
        setIsSubmitted(true);
    }
    
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm px-6 py-4 border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#7A9CEB]">
            <img src="/logo2.svg" alt="Mathy" className="w-90 h-10" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-[#7A9CEB] transition-colors">
              首頁
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-[#7A9CEB] transition-colors">
              關於我們
            </Link>
            <Link href="/waitlist" className="bg-[#7A9CEB] hover:bg-[#6B8CD9] text-white px-4 py-2 rounded-lg font-medium transition-colors">
              加入等待名單
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="text-center">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[#2B2B2B] mb-3">
                加入等待名單
              </h1>
              <p className="text-lg text-gray-600 max-w-lg mx-auto">
                Beta 測試版本即將推出！選擇您喜歡的方式加入，我們將在第一時間通知您。
              </p>
            </div>

            {/* Waitlist Form */}
            {!isSubmitted ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                <SupabaseForm onSuccess={handleSubmit} />
              </div>
            ) : (
              <div className="max-w-sm mx-auto">
                <div className="bg-green-50 rounded-xl p-6 shadow-lg">
                  <div className="text-green-600 mb-3">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    成功加入等待名單！
                  </h3>
                  <p className="text-green-700 text-sm">
                    我們將在 Beta 版本發布時通知您。
                  </p>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with Animals */}
      <footer className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/animals-group.png" 
              alt="Friendly animal characters" 
              className="w-full h-full"
            />
          </div>
          
        </div>
      </footer>
    </div>
  );
}