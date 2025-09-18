import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function verifyToken(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Yetkisiz.' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    return { decoded, isAdmin: decoded.role === 'admin' };
  } catch (err) {
    return NextResponse.json({ error: 'Geçersiz token.' }, { status: 401 });
  }
}

export function requireAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const result = verifyToken(req);
    if (result instanceof NextResponse) {
      return result;
    }
    return handler(req);
  };
}

export function requireAdmin(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const result = verifyToken(req);
    if (result instanceof NextResponse) {
      return result;
    }
    if (!result.isAdmin) {
      return NextResponse.json({ error: 'Admin yetkisi gerekli.' }, { status: 403 });
    }
    return handler(req);
  };
}