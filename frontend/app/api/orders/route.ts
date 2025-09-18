import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { createOrder, getOrders } from '@/lib/database';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {

    const token = req.cookies.get('authToken')?.value;
    const { items, shippingAddress, notes, isGuest } = await req.json();

    if (!items || !shippingAddress || items.length === 0) {
      return NextResponse.json({ error: 'Geçersiz sipariş verisi.' }, { status: 400 });
    }

    let userId = null;
    let email = '';

    if (!isGuest && token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        userId = decoded.userId;
        // Mock user email based on userId for demo
        if (userId === 'mock-admin') {
          email = 'admin@example.com';
        } else if (userId === 'mock-user') {
          email = 'user@example.com';
        }
      } catch (err) {
        console.error('Invalid token:', err);
      }
    } else {
      email = shippingAddress.email || 'misafir@example.com'; // Require email in address for guest
    }

    if (!email) {
      return NextResponse.json({ error: 'Email gerekli.' }, { status: 400 });
    }

    const total = items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);

    const order = await createOrder({
      userId,
      email,
      items,
      shippingAddress,
      status: 'preparing',
      notes,
    });

    // Send email notifications (commented for demo without SMTP)
    console.log(`Order #${order.id} created for ${email}. Emails would be sent if SMTP configured.`);

    return NextResponse.json({ 
      message: 'Sipariş oluşturuldu.',
      orderId: order.id,
      total 
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Sipariş oluşturulamadı.' }, { status: 500 });
  }
}

// GET all orders (admin only)
export async function GET(req: NextRequest) {
  try {

    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz.' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
    } catch (err) {
      return NextResponse.json({ error: 'Geçersiz token.' }, { status: 401 });
    }

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin yetkisi gerekli.' }, { status: 403 });
    }

    const orders = await getOrders();
    const sortedOrders = (orders as any[]).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order: any) => ({
      ...order,
      user: null, // No user join in mock
    }));
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ error: 'Siparişler alınamadı.' }, { status: 500 });
  }
}