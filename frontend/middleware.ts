import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/database';

connectDB(); // Connect early for models if needed

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
      if (decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/orders', req.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (pathname.startsWith('/orders') && !pathname.includes('admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*'],
};