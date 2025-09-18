// database/index.ts - Shared Mongoose connection and core models for Pandizot Shop
import mongoose, { Schema, models, model, Model } from 'mongoose';

// Cache connection across hot reloads in Next.js (dev)
type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: Cached | undefined;
}

export async function connectDB(uri?: string) {
  const MONGODB_URI = uri || process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }
  if (!global.mongooseCache) {
    global.mongooseCache = { conn: null, promise: null };
  }
  if (global.mongooseCache.conn) {
    return global.mongooseCache.conn;
  }
  if (!global.mongooseCache.promise) {
    global.mongooseCache.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || undefined,
    });
  }
  global.mongooseCache.conn = await global.mongooseCache.promise;
  return global.mongooseCache.conn;
}

// ============== User =================
export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
  },
  { timestamps: true }
);

export const User: Model<IUser> = models.User || model<IUser>('User', UserSchema);

// ============== Pricing Rules =================
export type SpeakerType = '4x20' | '4x16' | '4-oval';

export interface IPricingRule {
  vehicleBrand: string;
  vehicleModel: string;
  basePrice: number; // base price for brand/model
  multipliers: {
    speakerType: Partial<Record<SpeakerType, number>>; // e.g., { '4x20': 1.0, '4x16': 0.95, '4-oval': 1.15 }
    tweeterUnitPrice: number; // add-on price per tweeter
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PricingRuleSchema = new Schema<IPricingRule>(
  {
   vehicleBrand: { type: String, required: true, index: true, trim: true },
   vehicleModel: { type: String, required: true, index: true, trim: true },
   basePrice: { type: Number, required: true, min: 0 },
   multipliers: {
     speakerType: {
       type: Map,
       of: Number,
       default: { '4x20': 1, '4x16': 0.95, '4-oval': 1.1 },
     },
     tweeterUnitPrice: { type: Number, default: 0 },
   },
   isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

PricingRuleSchema.index({ vehicleBrand: 1, vehicleModel: 1 }, { unique: true });

export const PricingRule: Model<IPricingRule> =
  models.PricingRule || model<IPricingRule>('PricingRule', PricingRuleSchema);

// ============== Orders =================
export type OrderStatus = 'preparing' | 'shipped' | 'delivered';

export interface IOrderItem {
  vehicleBrand: string;
  vehicleModel: string;
  speakerType: SpeakerType;
  speakerCount: number; // number of speakers (e.g., 4)
  tweeterCount: number; // number of tweeters (e.g., 0, 2)
  options?: string[]; // extra textual options, e.g., material, color, stitching
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  previewImageUrl?: string;
}

export interface IOrder {
  userId: Schema.Types.ObjectId | null; // null for guest checkout
  email: string;
  items: IOrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district?: string;
    postalCode?: string;
    country: string;
  };
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    vehicleBrand: { type: String, required: true, trim: true },
    vehicleModel: { type: String, required: true, trim: true },
    speakerType: { type: String, enum: ['4x20', '4x16', '4-oval'], required: true },
    speakerCount: { type: Number, required: true, min: 1 },
    tweeterCount: { type: Number, required: true, min: 0 },
    options: { type: [String], default: [] },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    previewImageUrl: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    items: { type: [OrderItemSchema], required: true, validate: (v: any[]) => v.length > 0 },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      district: { type: String },
      postalCode: { type: String },
      country: { type: String, required: true, default: 'TR' },
    },
    status: { type: String, enum: ['preparing', 'shipped', 'delivered'], default: 'preparing', index: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> = models.Order || model<IOrder>('Order', OrderSchema);

// ============== Price Computation Helper =================
export async function computePrice(input: {
  brand: string;
  model: string;
  speakerType: SpeakerType;
  speakerCount: number;
  tweeterCount: number;
}): Promise<number> {
  await connectDB();
  const rule = await PricingRule.findOne({
    vehicleBrand: input.brand,
    vehicleModel: input.model,
    isActive: true,
  }).lean();

  // Base and multipliers
  const base = rule?.basePrice ?? 100;
  const typeMult =
    (rule?.multipliers?.speakerType?.get
      ? // Map instance when read back via mongoose Map
        (rule?.multipliers?.speakerType as any).get(input.speakerType) as number | undefined
      : // plain object during direct hydration
        (rule?.multipliers?.speakerType as any)?.[input.speakerType]) ?? 1;
  const tweeterUnit = rule?.multipliers?.tweeterUnitPrice ?? 0;

  // Simple fair formula: base * type + extra speakers + tweeters
  const extraSpeakerCount = Math.max(0, input.speakerCount - 2);
  const price = base * typeMult + extraSpeakerCount * 25 + input.tweeterCount * tweeterUnit;
  return Math.round(price);
}

// Utility: Ensure indices exist (can be used in bootstrap scripts)
export async function ensureIndexes() {
  await connectDB();
  await Promise.all([
    User.syncIndexes(),
    PricingRule.syncIndexes(),
    Order.syncIndexes(),
  ]);
}

// Example seed helper (no-op placeholder)
export async function seedExamples() {
  await connectDB();
  const count = await PricingRule.countDocuments({});
  if (count === 0) {
    await PricingRule.create([
      {
        vehicleBrand: 'Volkswagen',
        vehicleModel: 'Golf',
        basePrice: 120,
        multipliers: { speakerType: { '4x20': 1, '4x16': 0.95, '4-oval': 1.1 }, tweeterUnitPrice: 30 },
      },
      {
        vehicleBrand: 'Toyota',
        vehicleModel: 'Corolla',
        basePrice: 110,
        multipliers: { speakerType: { '4x20': 1, '4x16': 0.93, '4-oval': 1.08 }, tweeterUnitPrice: 25 },
      },
    ]);
  }
}