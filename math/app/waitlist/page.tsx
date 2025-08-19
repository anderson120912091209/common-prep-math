'use client'

import { useState } from 'react';
import Link from 'next/link';
import Form from '../components/waitlist-ui/form';   
import { toast } from "sonner";


export default function WaitlistPage() {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = () => {
        setIsSubmitted(true);
        setLoading(true);
    }
    
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo2.svg" alt="Mathy Logo" className="h-10 w-auto" />
          </Link>
          <Link 
            href="/" 
            className="text-gray-600 hover:text-[#2B2B2B] font-medium transition-colors"
          >
            返回首頁
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] mb-4">
              加入等待名單
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Beta 測試版本即將推出！留下您的電子郵件，我們將在第一時間通知您。
            </p>
          </div>

          {/* Waitlist Form */}
          {!isSubmitted ? (
            <Form onSuccess={handleSubmit} />
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-green-600 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  成功加入等待名單！
                </h3>
                <p className="text-green-700">
                  我們將在 Beta 版本發布時通知您。
                </p>
              </div>
            </div>
          )}

          </div>
        </div>
      </div>
  );
}
