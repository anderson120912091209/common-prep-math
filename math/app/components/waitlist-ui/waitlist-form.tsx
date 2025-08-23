'use client'

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';  
import { toast } from "sonner";

interface SupabaseFormProps {
  onSuccess?: () => void;
}

export default function SupabaseForm({ onSuccess }: SupabaseFormProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook') => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/waitlist/success`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast.error(`登入失敗: ${error.message}`);
        setLoading(false);
        return;
      }

      // The user will be redirected to the OAuth provider
      // We'll handle the success case in the success page
      
    } catch (error) {
      toast.error('發生錯誤，請稍後再試');
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;

    try {
      // First, sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-12), // Generate random password
        options: {
          data: {
            name: name,
            provider: 'email'
          }
        }
      });

      if (authError) {
        toast.error(`註冊失敗: ${authError.message}`);
        setLoading(false);
        return;
      }

      // Add to waitlist table
      const { error: waitlistError } = await supabase
        .from('waitlist')
        .insert([
          {
            email: email,
            name: name,
            provider: 'email',
            user_id: authData.user?.id
          }
        ]);

      if (waitlistError) {
        toast.error('加入等待名單失敗，請稍後再試');
        setLoading(false);
        return;
      }

      toast.success('成功加入等待名單！請檢查您的電子郵件以確認帳戶。');
      onSuccess?.();
      
    } catch (error) {
      toast.error('發生錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Social Login Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          使用 Google 帳戶加入
        </button>

        <button
          onClick={() => handleSocialLogin('github')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          使用 GitHub 帳戶加入
        </button>

        <button
          onClick={() => handleSocialLogin('facebook')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          使用 Facebook 帳戶加入
        </button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">或</span>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleEmailSignup} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder="您的姓名"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A9CEB] focus:border-transparent outline-none transition-all text-[#2B2B2B] placeholder-gray-400"
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="您的電子郵件"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A9CEB] focus:border-transparent outline-none transition-all text-[#2B2B2B] placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#7A9CEB] hover:bg-[#6B8CD9] disabled:bg-gray-400 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
        >
          {loading ? "處理中..." : "使用電子郵件加入"}
        </button>
      </form>
    </div>
  );
}