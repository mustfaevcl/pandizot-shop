import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email ve şifre gerekli.' }, { status: 400 });
    }

    // Mock login for demo
    if (email === 'admin@example.com' && password === 'admin') {
      const token = jwt.sign(
        { userId: 'mock-admin', email, role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );
      const response = NextResponse.json({
        message: 'Giriş başarılı. (Demo modu)',
        user: { id: 'mock-admin', name: 'Demo Admin', email, role: 'admin' }
      });
      response.cookies.set('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
      });
      return response;
    }
    if (email === 'user@example.com' && password === 'password') {
      const token = jwt.sign(
        { userId: 'mock-user', email, role: 'user' },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );
      const response = NextResponse.json({
        message: 'Giriş başarılı. (Demo modu)',
        user: { id: 'mock-user', name: 'Demo User', email, role: 'user' }
      });
      response.cookies.set('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
      });
      return response;
    }
    return NextResponse.json({ error: 'Geçersiz email veya şifre. Demo: admin@example.com / admin veya user@example.com / password dene.' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}