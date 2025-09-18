// database/index.ts - Shared Prisma client and core functions for Pandizot Shop
'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============== User =================
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// ============== Pricing Rules =================
export type SpeakerType = '4x20' | '4x16' | '4-oval';

export interface PricingRule {
  id: string;
  vehicleBrand: string;
  vehicleModel: string;
  basePrice: number;
  speakerTypeMultipliers: any; // Json for multipliers
  tweeterUnitPrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============== Orders =================
export type OrderStatus = 'preparing' | 'shipped' | 'delivered';

export interface OrderItem {
  vehicleBrand: string;
  vehicleModel: string;
  speakerType: SpeakerType;
  speakerCount: number;
  tweeterCount: number;
  options?: string[];
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  previewImageUrl?: string;
}

export interface Order {
  id: string;
  userId: string | null;
  email: string;
  items: OrderItem[];
  shippingAddress: any; // Json
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============== Price Computation Helper =================
export async function computePrice(input: {
  brand: string;
  model: string;
  speakerType: SpeakerType;
  speakerCount: number;
  tweeterCount: number;
}): Promise<number> {
  const rule = await prisma.pricingRule.findFirst({
    where: {
      vehicleBrand: input.brand,
      vehicleModel: input.model,
      isActive: true,
    },
  });

  // Base and multipliers
  const base = rule?.basePrice ?? 100;
  const typeMult = rule?.speakerTypeMultipliers ? (rule.speakerTypeMultipliers as Record<SpeakerType, number>)[input.speakerType] ?? 1 : 1;
  const tweeterUnit = rule?.tweeterUnitPrice ?? 0;

  // Simple fair formula: base * type + extra speakers + tweeters
  const extraSpeakerCount = Math.max(0, input.speakerCount - 2);
  const price = base * typeMult + extraSpeakerCount * 25 + input.tweeterCount * tweeterUnit;
  return Math.round(price);
}

// Utility: Ensure DB is ready (Prisma handles connection)
export async function ensureDB() {
  // Prisma auto-connects
  await prisma.$connect();
}

// Example seed helper
export async function seedExamples() {
  const count = await prisma.pricingRule.count();
  if (count === 0) {
    await prisma.pricingRule.createMany({
      data: [
        {
          vehicleBrand: 'Volkswagen',
          vehicleModel: 'Golf',
          basePrice: 120,
          speakerTypeMultipliers: { '4x20': 1, '4x16': 0.95, '4-oval': 1.1 },
          tweeterUnitPrice: 30,
        },
        {
          vehicleBrand: 'Toyota',
          vehicleModel: 'Corolla',
          basePrice: 110,
          speakerTypeMultipliers: { '4x20': 1, '4x16': 0.93, '4-oval': 1.08 },
          tweeterUnitPrice: 25,
        },
      ],
    });
  }
}

export { prisma };