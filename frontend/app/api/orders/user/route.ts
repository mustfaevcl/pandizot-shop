import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import jwt from 'jsonwebtoken';
import { getUserOrders } from '@/lib/database';
import { requireAuth } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  const handler = requireAuth(async (req: NextRequest) => {
    try {
      const token = req.cookies.get('authToken')?.value;
      let userId: string;

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        userId = decoded.userId;
      } else {
        return NextResponse.json({ error: 'Yetkisiz.' }, { status: 401 });
      }

      const orders = await getUserOrders(userId);
      return NextResponse.json(orders);
    } catch (error) {
      console.error('Get user orders error:', error);
      return NextResponse.json({ error: 'Siparişler alınamadı.' }, { status: 500 });
    }
  });

  return handler(req);
}