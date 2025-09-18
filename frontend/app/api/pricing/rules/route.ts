import { NextRequest, NextResponse } from 'next/server';
import { connectDB, PricingRule, IPricingRule } from '@/lib/database';
import { requireAdmin } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  const handler = requireAdmin(async (req: NextRequest) => {
    try {
      await connectDB();
      const rules = await PricingRule.find({ isActive: true }).lean();
      return NextResponse.json(rules);
    } catch (error) {
      console.error('Get pricing rules error:', error);
      return NextResponse.json({ error: 'Kurallar alınamadı.' }, { status: 500 });
    }
  });

  return handler(req);
}

export async function POST(req: NextRequest) {
  const handler = requireAdmin(async (req: NextRequest) => {
    try {
      await connectDB();
      const data: Omit<IPricingRule, 'createdAt' | 'updatedAt'> = await req.json();

      if (!data.vehicleBrand || !data.vehicleModel || data.basePrice <= 0) {
        return NextResponse.json({ error: 'Geçersiz veri.' }, { status: 400 });
      }

      const existing = await PricingRule.findOne({
        vehicleBrand: data.vehicleBrand,
        vehicleModel: data.vehicleModel,
      });

      if (existing) {
        return NextResponse.json({ error: 'Bu marka/model zaten var.' }, { status: 409 });
      }

      const rule = await PricingRule.create(data);
      return NextResponse.json({ message: 'Kural eklendi.', rule: rule.toObject() }, { status: 201 });
    } catch (error) {
      console.error('Create pricing rule error:', error);
      return NextResponse.json({ error: 'Kural eklenemedi.' }, { status: 500 });
    }
  });

  return handler(req);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const handler = requireAdmin(async (req: NextRequest) => {
    try {
      await connectDB();
      const { id } = params;
      const updateData: Partial<IPricingRule> = await req.json();

      const rule = await PricingRule.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();

      if (!rule) {
        return NextResponse.json({ error: 'Kural bulunamadı.' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Kural güncellendi.', rule });
    } catch (error) {
      console.error('Update pricing rule error:', error);
      return NextResponse.json({ error: 'Kural güncellenemedi.' }, { status: 500 });
    }
  });

  return handler(req);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const handler = requireAdmin(async (req: NextRequest) => {
    try {
      await connectDB();
      const { id } = params;

      const rule = await PricingRule.findByIdAndUpdate(id, { isActive: false }, { new: true });

      if (!rule) {
        return NextResponse.json({ error: 'Kural bulunamadı.' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Kural devre dışı bırakıldı.' });
    } catch (error) {
      console.error('Delete pricing rule error:', error);
      return NextResponse.json({ error: 'Kural silinemedi.' }, { status: 500 });
    }
  });

  return handler(req);
}