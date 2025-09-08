'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface TeacherLoginButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export function TeacherLoginButton({ 
  className = '',
  size = 'md',
  variant = 'primary'
}: TeacherLoginButtonProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // Admin email whitelist - synchronized with middleware
  const ADMIN_EMAILS = [
    'chenzhengyang070@gmail.com',
    'teacher@school.edu',
  ];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const userEmail = user.email?.toLowerCase();
        const hasAdminAccess = !!(userEmail && ADMIN_EMAILS.includes(userEmail));
        setIsAdmin(hasAdminAccess);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        const userEmail = session.user.email?.toLowerCase();
        const hasAdminAccess = !!(userEmail && ADMIN_EMAILS.includes(userEmail));
        setIsAdmin(hasAdminAccess);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleTeacherLogin = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            hd: 'gmail.com', // Optional: restrict to specific domain
          },
        },
      });

      if (error) {
        console.error('Login error:', error);
        alert('登入失敗，請稍後再試');
      }
      
      // User will be redirected to OAuth provider
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('發生錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleGoToAdmin = () => {
    router.push('/admin/dashboard');
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-orange-600 hover:bg-orange-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white border border-gray-300'
  };

  // If user is logged in and is admin, show admin controls
  if (user && isAdmin) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <button
          onClick={handleGoToAdmin}
          className={`${sizeClasses[size]} ${variantClasses.primary} rounded-md font-medium transition-colors flex items-center space-x-2`}
        >
          <span>🛠️</span>
          <span>管理面板</span>
        </button>
        <button
          onClick={handleLogout}
          className={`${sizeClasses[size]} bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors`}
        >
          登出
        </button>
      </div>
    );
  }

  // If user is logged in but not admin, show different message
  if (user && !isAdmin) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className="text-sm text-gray-600">
          歡迎，{user.user_metadata?.name || user.email}
        </span>
        <button
          onClick={handleLogout}
          className={`${sizeClasses[size]} bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors`}
        >
          登出
        </button>
      </div>
    );
  }

  // If not logged in, show teacher login button
  return (
    <button
      onClick={handleTeacherLogin}
      disabled={loading}
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-md font-medium transition-colors disabled:opacity-50 flex items-center space-x-2 ${className}`}
    >
      <span>👩‍🏫</span>
      <span>{loading ? '登入中...' : '教師登入'}</span>
    </button>
  );
}

// Simplified version for quick use
export function QuickTeacherLogin() {
  return <TeacherLoginButton size="sm" variant="secondary" />;
}

// Enhanced version with more features
export function AdminAccessWidget() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const ADMIN_EMAILS = [
    'chenzhengyang070@gmail.com',
    'teacher@school.edu',
  ];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const userEmail = user.email?.toLowerCase();
        const hasAdminAccess = !!(userEmail && ADMIN_EMAILS.includes(userEmail));
        setIsAdmin(hasAdminAccess);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        const userEmail = session.user.email?.toLowerCase();
        const hasAdminAccess = !!(userEmail && ADMIN_EMAILS.includes(userEmail));
        setIsAdmin(hasAdminAccess);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-orange-100 border border-orange-300 rounded-lg p-4 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <span className="text-2xl">🛠️</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-orange-800">
            管理員模式
          </p>
          <p className="text-xs text-orange-600">
            {user.email}
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={() => window.location.href = '/admin/dashboard'}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            進入管理面板
          </button>
        </div>
      </div>
    </div>
  );
}
