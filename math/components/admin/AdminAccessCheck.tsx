'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Admin email whitelist - Add your emails here!
const ADMIN_EMAILS = [
  'chenzhengyang070@gmail.com',    // Your email
  'teacher@school.edu',            // Add teacher emails
  // Add more admin emails as needed
];

export function AdminAccessCheck({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Get current user
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          router.push('/waitlist?message=Please login to access admin features');
          return;
        }

        // Check if user email is in admin whitelist
        const userEmail = user.email?.toLowerCase();
        const hasAdminAccess = userEmail && ADMIN_EMAILS.includes(userEmail);

        if (!hasAdminAccess) {
          router.push('/unauthorized');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/unauthorized');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  return isAdmin ? <>{children}</> : null;
}
