'use server';

// In-memory store for demo mode - no external DB required
let users = [
  { id: 'mock-admin', name: 'Demo Admin', email: 'admin@example.com', passwordHash: '$2a$10$mockhash', role: 'admin' },
  { id: 'mock-user', name: 'Demo User', email: 'user@example.com', passwordHash: '$2a$10$mockhash', role: 'user' },
];

let pricingRules = [
  {
    id: '1',
    vehicleBrand: 'Volkswagen',
    vehicleModel: 'Golf',
    basePrice: 120,
    speakerTypeMultipliers: { '4x20': 1, '4x16': 0.95, '4-oval': 1.1 },
    tweeterUnitPrice: 30,
    isActive: true,
  },
  {
    id: '2',
    vehicleBrand: 'Toyota',
    vehicleModel: 'Corolla',
    basePrice: 110,
    speakerTypeMultipliers: { '4x20': 1, '4x16': 0.93, '4-oval': 1.08 },
    tweeterUnitPrice: 25,
    isActive: true,
  },
];

let orders = [];

// ============== User Functions =================
export async function findUserByEmail(email: string) {
  return users.find(u => u.email === email.toLowerCase());
}

export async function createUser(data: { name: string; email: string; passwordHash: string; role: string }) {
  const user = { id: Date.now().toString(), ...data, createdAt: new Date(), updatedAt: new Date() };
  users.push(user);
  return user;
}

// ============== Pricing Rules Functions =================
export type SpeakerType = '4x20' | '4x16' | '4-oval';

export async function findPricingRule(brand: string, model: string) {
  return pricingRules.find(r => r.vehicleBrand === brand && r.vehicleModel === model && r.isActive);
}

export async function getPricingRules() {
  return pricingRules.filter(r => r.isActive);
}

export async function createPricingRule(data: any) {
  const rule = { id: Date.now().toString(), ...data, createdAt: new Date(), updatedAt: new Date() };
  pricingRules.push(rule);
  return rule;
}

export async function updatePricingRule(id: string, updates: any) {
  const index = pricingRules.findIndex(r => r.id === id);
  if (index !== -1) {
    pricingRules[index] = { ...pricingRules[index], ...updates, updatedAt: new Date() };
    return pricingRules[index];
  }
  return null;
}

// ============== Orders Functions =================
export type OrderStatus = 'preparing' | 'shipped' | 'delivered';

export async function createOrder(data: any) {
  const order = { id: Date.now().toString(), ...data, createdAt: new Date(), updatedAt: new Date() };
  orders.push(order);
  return order;
}

export async function getOrders() {
  return orders;
}

export async function getUserOrders(userId: string) {
  return orders.filter(o => o.userId === userId);
}

// ============== Price Computation Helper =================
export async function computePrice(input: {
  brand: string;
  model: string;
  speakerType: SpeakerType;
  speakerCount: number;
  tweeterCount: number;
}): Promise<number> {
  const rule = await findPricingRule(input.brand, input.model);

  const base = rule?.basePrice ?? 100;
  const typeMult = rule?.speakerTypeMultipliers ? (rule.speakerTypeMultipliers as Record<SpeakerType, number>)[input.speakerType] ?? 1 : 1;
  const tweeterUnit = rule?.tweeterUnitPrice ?? 0;

  const extraSpeakerCount = Math.max(0, input.speakerCount - 2);
  const price = base * typeMult + extraSpeakerCount * 25 + input.tweeterCount * tweeterUnit;
  return Math.round(price);
}

// ============== Auth Helpers =================
export function getMockHash() {
  return '$2a$10$mockhash'; // Dummy hash for demo
}

// Initialize data
users = [
  { id: 'mock-admin', name: 'Demo Admin', email: 'admin@example.com', passwordHash: getMockHash(), role: 'admin' },
  { id: 'mock-user', name: 'Demo User', email: 'user@example.com', passwordHash: getMockHash(), role: 'user' },
];