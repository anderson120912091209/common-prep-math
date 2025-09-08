'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AdminDebugInfoProps {
  showDebug?: boolean;
}

export function AdminDebugInfo({ showDebug = false }: AdminDebugInfoProps) {
  const [user, setUser] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(showDebug);

  const ADMIN_EMAILS = [
    'chenzhengyang070@gmail.com',
    'teacher@school.edu',
  ];

  useEffect(() => {
    const loadDebugInfo = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const userEmail = user.email?.toLowerCase();
          const hasAdminAccess = userEmail && ADMIN_EMAILS.includes(userEmail);
          
          setDebugInfo({
            isAuthenticated: !!user,
            userEmail: user.email,
            userEmailLower: userEmail,
            userId: user.id,
            userMetadata: user.user_metadata,
            appMetadata: user.app_metadata,
            adminEmails: ADMIN_EMAILS,
            hasAdminAccess,
            emailInList: ADMIN_EMAILS.includes(userEmail || ''),
            currentUrl: window.location.href,
            timestamp: new Date().toISOString()
          });
        } else {
          setDebugInfo({
            isAuthenticated: false,
            message: 'No user logged in',
            currentUrl: window.location.href,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        setDebugInfo({
          error: error,
          message: 'Error loading user info',
          timestamp: new Date().toISOString()
        });
      }
    };

    loadDebugInfo();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      loadDebugInfo();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-blue-600 text-white px-2 py-1 rounded text-xs z-50"
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white text-xs p-4 rounded-lg max-w-md max-h-96 overflow-auto z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-yellow-400">🐛 Admin Debug Info</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:text-red-400"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <strong className="text-green-400">Authentication Status:</strong>
          <div className="ml-2">
            <div>Authenticated: {debugInfo.isAuthenticated ? '✅' : '❌'}</div>
            {user && (
              <>
                <div>Email: {debugInfo.userEmail}</div>
                <div>Email (lower): {debugInfo.userEmailLower}</div>
                <div>User ID: {debugInfo.userId}</div>
                <div>Provider: {debugInfo.userMetadata?.provider || debugInfo.appMetadata?.provider}</div>
              </>
            )}
          </div>
        </div>

        <div>
          <strong className="text-yellow-400">Admin Access Check:</strong>
          <div className="ml-2">
            <div>Has Admin Access: {debugInfo.hasAdminAccess ? '✅' : '❌'}</div>
            <div>Email in Admin List: {debugInfo.emailInList ? '✅' : '❌'}</div>
            <div>Admin Emails: {JSON.stringify(debugInfo.adminEmails)}</div>
          </div>
        </div>

        <div>
          <strong className="text-blue-400">Environment:</strong>
          <div className="ml-2">
            <div>Current URL: {debugInfo.currentUrl}</div>
            <div>Timestamp: {debugInfo.timestamp}</div>
          </div>
        </div>

        {debugInfo.error && (
          <div>
            <strong className="text-red-400">Error:</strong>
            <div className="ml-2 text-red-300">
              {JSON.stringify(debugInfo.error, null, 2)}
            </div>
          </div>
        )}

        <div className="mt-4 pt-2 border-t border-gray-600">
          <strong className="text-purple-400">Quick Actions:</strong>
          <div className="mt-1 space-y-1">
            <button
              onClick={() => window.location.href = '/admin/dashboard'}
              className="block w-full text-left bg-orange-600 hover:bg-orange-700 px-2 py-1 rounded text-xs"
            >
              🛠️ Go to Admin Dashboard
            </button>
            <button
              onClick={() => window.location.href = '/waitlist'}
              className="block w-full text-left bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
            >
              🔐 Go to Login
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.reload();
              }}
              className="block w-full text-left bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
