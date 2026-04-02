import { NextRequest, NextResponse } from 'next/server';

const ROUTE_LIMITS: Record<string, number> = {
  '/api/generate': 50 * 1024, // 50KB
  '/api/voice': 100 * 1024,   // 100KB
  '/api/auth/session': 5 * 1024,
  '/api/stripe/webhook': 100 * 1024,
  '/api/stripe/checkout': 5 * 1024,
};

export function middleware(request: NextRequest) {
  if (request.method === 'POST') {
    const contentLength = request.headers.get('content-length');
    const pathname = request.nextUrl.pathname;

    for (const [route, limit] of Object.entries(ROUTE_LIMITS)) {
      if (pathname.startsWith(route) && contentLength) {
        const size = parseInt(contentLength);
        if (size > limit) {
          return NextResponse.json(
            { error: 'Request body too large' },
            { status: 413 }
          );
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
