import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { computePrice, SpeakerType } from '@/lib/database';

export async function POST(req: NextRequest) {
  try {
    const { brand, model, speakerType, speakerCount = 4, tweeterCount = 0 } = await req.json();

    if (!brand || !model || !speakerType) {
      return NextResponse.json({ error: 'Marka, model ve hoparlör tipi gerekli.' }, { status: 400 });
    }

    if (speakerCount < 1 || tweeterCount < 0) {
      return NextResponse.json({ error: 'Geçersiz miktar.' }, { status: 400 });
    }

    const price = await computePrice({
      brand,
      model,
      speakerType: speakerType as SpeakerType,
      speakerCount,
      tweeterCount,
    });

    return NextResponse.json({ price, message: 'Fiyat hesaplandı.' });
  } catch (error) {
    console.error('Pricing compute error:', error);
    return NextResponse.json({ error: 'Fiyat hesaplama hatası.' }, { status: 500 });
  }
}