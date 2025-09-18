import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { getPricingRules, createPricingRule, updatePricingRule, findPricingRule } from '@/lib/database';
import { requireAdmin } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  const handler = requireAdmin(async (req: NextRequest) => {
    try {
      const rules = await getPricingRules();
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
      const data = await req.json();

      if (!data.vehicleBrand || !data.vehicleModel || data.basePrice <= 0) {
        return NextResponse.json({ error: 'Geçersiz veri.' }, { status: 400 });
      }

      const existing = await findPricingRule(data.vehicleBrand, data.vehicleModel);

      if (existing) {
        return NextResponse.json({ error: 'Bu marka/model zaten var.' }, { status: 409 });
      }

      const rule = await createPricingRule({
        vehicleBrand: data.vehicleBrand,
        vehicleModel: data.vehicleModel,
        basePrice: data.basePrice,
        speakerTypeMultipliers: data.multipliers.speakerType,
        tweeterUnitPrice: data.multipliers.tweeterUnitPrice,
        isActive: true,
      });
      return NextResponse.json({ message: 'Kural eklendi.', rule }, { status: 201 });
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
      const { id } = params;
      const updateData = await req.json();

      const rule = await updatePricingRule(id, updateData);

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
      const { id } = params;

      const rule = await updatePricingRule(id, { isActive: false });

      return NextResponse.json({ message: 'Kural devre dışı bırakıldı.' });
    } catch (error) {
      console.error('Delete pricing rule error:', error);
      return NextResponse.json({ error: 'Kural silinemedi.' }, { status: 500 });
    }
  });

  return handler(req);
}