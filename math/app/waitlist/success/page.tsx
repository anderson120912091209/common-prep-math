'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

export default function WaitlistSuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth error:', error);
          router.push('/waitlist');
          return;
        }

        if (user) {
          setUser(user);
          
          // Add user to waitlist table
          const { error: waitlistError } = await supabase
            .from('waitlist')
            .insert([
              {
                email: user.email,
                name: user.user_metadata?.name || user.user_metadata?.full_name,
                provider: user.app_metadata?.provider || 'oauth',
                avatar_url: user.user_metadata?.avatar_url,
                user_id: user.id
              }
            ])
            .select()
            .single();

          if (waitlistError && !waitlistError.message.includes('duplicate')) {
            console.error('Waitlist error:', waitlistError);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A9CEB] mx-auto mb-4"></div>
          <p className="text-gray-600">正在處理您的註冊...</p>
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
          <Link href="/" className="text-gray-600 hover:text-[#2B2B2B] font-medium transition-colors">
            返回首頁
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <div className="text-green-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                成功加入等待名單！
              </h3>
              <p className="text-green-700 mb-6">
                感謝您使用 {user?.user_metadata?.provider || '電子郵件'} 帳戶加入我們的等待名單。
                我們將在 Beta 版本發布時通知您。
              </p>
              
              {user?.user_metadata?.avatar_url && (
                <div className="mb-4">
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full mx-auto border-2 border-green-200"
                  />
                </div>
              )}
              
              <Link 
                href="/"
                className="inline-block bg-[#7A9CEB] hover:bg-[#6B8CD9] text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                返回首頁
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}