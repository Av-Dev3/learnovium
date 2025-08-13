import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // For now, let's use a simpler approach without Supabase client in middleware
  // The protected layout will handle authentication checks
  
  // If accessing app routes, allow the request to proceed
  // The layout will handle auth checks and redirects
  if (req.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.next();
  }

  return NextResponse.next();
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