'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

export default function ActualProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          router.push('/waitlist');
          return;
        }

        // TODO: Add additional checks for actual product access
        // For now, redirect to testing since actual product isn't ready
        router.push('/product/testing');
        
      } catch (error) {
        console.error('Error checking user access:', error);
        router.push('/waitlist');
      } finally {
        setLoading(false);
      }
    };

    checkUserAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A9CEB] mx-auto mb-4"></div>
          <p className="text-gray-600">檢查訪問權限...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo2.svg" alt="Mathy Logo" className="h-10 w-auto" />
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          正式產品即將推出
        </h1>
        <p className="text-gray-600 mb-8">
          我們正在努力開發完整版本的 Mathy，敬請期待！
        </p>
        <Link 
          href="/product/testing"
          className="inline-block bg-[#7A9CEB] hover:bg-[#6B8CD9] text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          體驗測試版本
        </Link>
      </div>
    </div>
  );
}
