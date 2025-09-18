import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, User, PricingRule, Order, seedExamples } from '../lib/database';

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await PricingRule.deleteMany({});
    await Order.deleteMany({});

    // Create admin user
    const adminPassword = 'admin';
    const adminHash = bcrypt.hashSync(adminPassword, 10);
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@example.com',
      passwordHash: adminHash,
      role: 'admin',
    });

    // Create test users
    const userHash = bcrypt.hashSync('password', 10);
    await User.create([
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
    ]);

    // Seed pricing rules
    await seedExamples();

    // Create test orders
    const testUser = await User.findOne({ email: 'user@example.com' });
    if (testUser) {
      await Order.create([
        {
          userId: testUser._id,
          email: testUser.email,
          items: [
            {
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
          ],
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
          userId: testUser._id,
          email: testUser.email,
          items: [
            {
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
          ],
          shippingAddress: {
            fullName: 'Test User',
            phone: '555-1234',
            addressLine1: 'Test Adres 456',
            city: 'Ankara',
            country: 'TR',
          },
          status: 'preparing',
        },
      ]);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();