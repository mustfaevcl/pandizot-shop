import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/database';

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
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        if (user) email = user.email;
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

    const order = await prisma.order.create({
      data: {
        userId,
        email,
        items,
        shippingAddress,
        status: 'preparing',
        notes,
      },
    });

    // Send email notifications
    try {
      // Customer email
      await transporter.sendMail({
        from: '"Pandizot Shop" <noreply@pandizotshop.com>',
        to: email,
        subject: 'Siparişiniz Alındı!',
        html: `
          <h1>Sipariş #${order.id} Onaylandı</h1>
          <p>Teşekkürler! Siparişiniz alındı ve hazırlanıyor.</p>
          <p>Toplam: ${total} TL</p>
          <p>Durum: ${order.status}</p>
          <p>Takip etmek için giriş yapın.</p>
        `,
      });

      // Admin email
      await transporter.sendMail({
        from: '"Pandizot Shop" <noreply@pandizotshop.com>',
        to: 'admin@pandizotshop.com', // Or from env
        subject: `Yeni Sipariş #${order.id}`,
        html: `
          <h1>Yeni Sipariş!</h1>
          <p>Müşteri: ${email}</p>
          <p>Toplam: ${total} TL</p>
          <p>Detaylar: Admin panelinden görüntüleyin.</p>
        `,
      });
    } catch (mailErr) {
      console.error('Mail error:', mailErr);
      // Don't fail the order on mail error
    }

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

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    }).then(orders => orders.map(order => ({
      ...order,
      user: order.user ? { name: order.user.name, email: order.user.email } : null,
    })));
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ error: 'Siparişler alınamadı.' }, { status: 500 });
  }
}