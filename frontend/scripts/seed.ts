import bcrypt from 'bcryptjs';
import { prisma, seedExamples } from '../lib/database';

const seed = async () => {
  try {
    // Clear existing data
    await prisma.user.deleteMany({});
    await prisma.pricingRule.deleteMany({});
    await prisma.order.deleteMany({});

    // Create admin user
    const adminPassword = 'admin';
    const adminHash = bcrypt.hashSync(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@example.com',
        passwordHash: adminHash,
        role: 'admin',
      },
    });

    // Create test users
    const userHash = bcrypt.hashSync('password', 10);
    await prisma.user.createMany({
      data: [
        {
          name: 'Test User',
          email: 'user@example.com',
          passwordHash: userHash,
          role: 'user',
        },
        {
          name: 'Test User 2',
          email: 'user2@example.com',
          passwordHash: userHash,
          role: 'user',
        },
      ],
    });

    // Seed pricing rules
    await seedExamples();

    // Create test orders
    const testUser = await prisma.user.findUnique({
      where: { email: 'user@example.com' },
    });
    if (testUser) {
      await prisma.order.createMany({
        data: [
          {
            userId: testUser.id,
            email: testUser.email,
            items: {
              vehicleBrand: 'Volkswagen',
              vehicleModel: 'Golf',
              speakerType: '4x20',
              speakerCount: 4,
              tweeterCount: 0,
              options: [],
              unitPrice: 120,
              quantity: 1,
              totalPrice: 120,
              previewImageUrl: '/speakers/4x20.jpg',
            },
            shippingAddress: {
              fullName: 'Test User',
              phone: '555-1234',
              addressLine1: 'Test Adres 123',
              city: 'İstanbul',
              country: 'TR',
            },
            status: 'delivered',
          },
          {
            userId: testUser.id,
            email: testUser.email,
            items: {
              vehicleBrand: 'Toyota',
              vehicleModel: 'Corolla',
              speakerType: '4-oval',
              speakerCount: 4,
              tweeterCount: 2,
              options: ['amplifier'],
              unitPrice: 250,
              quantity: 1,
              totalPrice: 250,
              previewImageUrl: '/speakers/oval.jpg',
            },
            shippingAddress: {
              fullName: 'Test User',
              phone: '555-1234',
              addressLine1: 'Test Adres 456',
              city: 'Ankara',
              country: 'TR',
            },
            status: 'preparing',
          },
        ],
      });
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();