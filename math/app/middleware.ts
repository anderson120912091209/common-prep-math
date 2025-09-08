import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Admin email whitelist - Add your team emails here
const ADMIN_EMAILS = [
  'chenzhengyang070@gmail.com'     // Replace with your email
];

// Admin Google account domains (optional - for school domains)
const ADMIN_DOMAINS = [
  'yourdomain.com',                // Your company domain
  'school.edu',                    // School domain
  // Add more as needed
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if this is an admin route
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    // Must be logged in to access admin routes
    if (!user) {
      const redirectUrl = new URL('/waitlist', req.url);
      redirectUrl.searchParams.set('message', 'Please login to access admin features');
      return NextResponse.redirect(redirectUrl);
    }

    // Check if user has admin access
    const isAdminUser = checkAdminAccess(user.email);
    
    if (!isAdminUser) {
      // Redirect to unauthorized page or student dashboard
      const redirectUrl = new URL('/unauthorized', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Add admin flag to headers for the app to use
    const response = NextResponse.next();
    response.headers.set('x-is-admin', 'true');
    response.headers.set('x-admin-email', user.email || '');
    return response;
  }

  return res;
}

function checkAdminAccess(email: string | undefined): boolean {
  if (!email) return false;

  // Check exact email match
  if (ADMIN_EMAILS.includes(email.toLowerCase())) {
    return true;
  }

  // Check domain match
  const emailDomain = email.split('@')[1];
  if (ADMIN_DOMAINS.includes(emailDomain)) {
    return true;
  }

  return false;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};