import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  await prisma.routeTask.deleteMany();
  await prisma.route.deleteMany();
  await prisma.task.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log('👤 Creating users...');

  const saltRounds = 10;
  const adminPassword = await bcrypt.hash('Admin123!', saltRounds);
  const driverPassword = await bcrypt.hash('Driver123!', saltRounds);
  const viewerPassword = await bcrypt.hash('Viewer123!', saltRounds);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@fleet.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phone: '+27123456789',
      isActive: true,
    },
  });

  const driver1 = await prisma.user.create({
    data: {
      email: 'driver1@fleet.com',
      password: driverPassword,
      firstName: 'John',
      lastName: 'Driver',
      role: 'driver',
      phone: '+27123456780',
      isActive: true,
    },
  });

  const driver2 = await prisma.user.create({
    data: {
      email: 'driver2@fleet.com',
      password: driverPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'driver',
      phone: '+27123456781',
      isActive: true,
    },
  });

  const viewer = await prisma.user.create({
    data: {
      email: 'viewer@fleet.com',
      password: viewerPassword,
      firstName: 'View',
      lastName: 'Only',
      role: 'viewer',
      phone: '+27123456782',
      isActive: true,
    },
  });

  console.log('✅ Created users:', {
    admin: admin.email,
    driver1: driver1.email,
    driver2: driver2.email,
    viewer: viewer.email,
  });

  // Create Vehicles
  console.log('🚗 Creating vehicles...');

  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        wialonId: 'wialon_12345',
        name: 'Delivery Van 1',
        licensePlate: 'ABC-123-GP',
        type: 'van',
        status: 'active',
        isOnline: true,
        currentLat: -26.195,
        currentLng: 28.034,
        currentSpeed: 0,
        lastMessageTime: new Date(),
        capacity: 1000,
        fuelType: 'diesel',
        make: 'Mercedes-Benz',
        model: 'Sprinter',
        year: 2022,
      },
    }),
    prisma.vehicle.create({
      data: {
        wialonId: 'wialon_12346',
        name: 'Delivery Van 2',
        licensePlate: 'DEF-456-GP',
        type: 'van',
        status: 'active',
        isOnline: true,
        currentLat: -26.2041,
        currentLng: 28.0473,
        currentSpeed: 45,
        lastMessageTime: new Date(),
        capacity: 1000,
        fuelType: 'diesel',
        make: 'Mercedes-Benz',
        model: 'Sprinter',
        year: 2023,
      },
    }),
    prisma.vehicle.create({
      data: {
        wialonId: 'wialon_12347',
        name: 'Heavy Truck 1',
        licensePlate: 'GHI-789-GP',
        type: 'truck',
        status: 'active',
        isOnline: false,
        currentLat: -26.185,
        currentLng: 28.024,
        currentSpeed: 0,
        lastMessageTime: new Date(Date.now() - 3600000), // 1 hour ago
        capacity: 5000,
        fuelType: 'diesel',
        make: 'Volvo',
        model: 'FH16',
        year: 2021,
      },
    }),
    prisma.vehicle.create({
      data: {
        wialonId: 'wialon_12348',
        name: 'Service Car 1',
        licensePlate: 'JKL-101-GP',
        type: 'car',
        status: 'maintenance',
        isOnline: false,
        currentLat: -26.175,
        currentLng: 28.014,
        currentSpeed: 0,
        lastMessageTime: new Date(Date.now() - 86400000), // 1 day ago
        capacity: 200,
        fuelType: 'petrol',
        make: 'Toyota',
        model: 'Hilux',
        year: 2020,
      },
    }),
  ]);

  console.log('✅ Created vehicles:', vehicles.length);

  // Create Tasks
  console.log('📋 Creating tasks...');

  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Delivery to Sandton City',
        description:
          'Deliver packages to Sandton City shopping mall - Main entrance',
        type: 'delivery',
        priority: 'high',
        status: 'pending',
        latitude: -26.1076,
        longitude: 28.0567,
        address:
          'Sandton City Shopping Centre, 83 Rivonia Rd, Sandhurst, Sandton, 2196',
        contactName: 'John Smith',
        contactPhone: '+27111234567',
        contactEmail: 'john.smith@example.com',
        scheduledStartTime: new Date(Date.now() + 3600000), // 1 hour from now
        estimatedDuration: 30,
        weight: 50,
        volume: 2.5,
        packageCount: 5,
        orderNumber: 'ORD-001',
        notes: 'Use service entrance. Contact security for access.',
      },
    }),
    prisma.task.create({
      data: {
        title: 'Pickup from Rosebank Mall',
        description: 'Collect packages from Rosebank retail office',
        type: 'pickup',
        priority: 'medium',
        status: 'pending',
        latitude: -26.1473,
        longitude: 28.0407,
        address:
          'The Zone @ Rosebank, 173 Oxford Rd, Rosebank, Johannesburg, 2196',
        contactName: 'Sarah Johnson',
        contactPhone: '+27112345678',
        contactEmail: 'sarah.johnson@example.com',
        scheduledStartTime: new Date(Date.now() + 7200000), // 2 hours from now
        estimatedDuration: 20,
        weight: 25,
        volume: 1.2,
        packageCount: 3,
        orderNumber: 'ORD-002',
        notes: 'Pickup at loading bay B2',
      },
    }),
    prisma.task.create({
      data: {
        title: 'Service Visit - Midrand Office Park',
        description: 'Routine equipment maintenance check',
        type: 'service',
        priority: 'low',
        status: 'assigned',
        latitude: -25.995,
        longitude: 28.129,
        address: 'Midrand Business Park, 256 16th Rd, Midrand, 1685',
        contactName: 'Mike Williams',
        contactPhone: '+27113456789',
        contactEmail: 'mike.williams@example.com',
        scheduledStartTime: new Date(Date.now() + 10800000), // 3 hours from now
        estimatedDuration: 45,
        orderNumber: 'SRV-001',
        notes: 'Bring maintenance toolkit and spare parts',
        userId: driver1.id,
        vehicleId: vehicles[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Urgent Delivery to Fourways Mall',
        description: 'Priority delivery - fragile items',
        type: 'delivery',
        priority: 'urgent',
        status: 'in_progress',
        latitude: -26.0125,
        longitude: 28.0055,
        address:
          'Fourways Mall, Cnr William Nicol & Fourways Blvd, Fourways, 2055',
        contactName: 'Emma Davis',
        contactPhone: '+27114567890',
        contactEmail: 'emma.davis@example.com',
        scheduledStartTime: new Date(Date.now() - 1800000), // 30 min ago
        actualStartTime: new Date(Date.now() - 1200000), // 20 min ago
        estimatedDuration: 40,
        weight: 75,
        volume: 3.0,
        packageCount: 8,
        orderNumber: 'ORD-003',
        notes: 'Handle with care - fragile electronics',
        userId: driver2.id,
        vehicleId: vehicles[1].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Completed Delivery - Woodmead',
        description: 'Package delivered successfully to Woodmead office',
        type: 'delivery',
        priority: 'medium',
        status: 'completed',
        latitude: -26.0733,
        longitude: 28.0957,
        address: 'Woodmead Retail Park, 145 Western Service Rd, Woodmead, 2191',
        contactName: 'David Brown',
        contactPhone: '+27115678901',
        contactEmail: 'david.brown@example.com',
        scheduledStartTime: new Date(Date.now() - 7200000), // 2 hours ago
        actualStartTime: new Date(Date.now() - 7000000),
        actualEndTime: new Date(Date.now() - 5400000), // 1.5 hours ago
        estimatedDuration: 25,
        weight: 30,
        packageCount: 4,
        orderNumber: 'ORD-004',
        completionNotes: 'Delivered successfully. Customer signed. No issues.',
        userId: driver1.id,
        vehicleId: vehicles[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Maintenance Task - Pretoria',
        description: 'Scheduled vehicle maintenance',
        type: 'maintenance',
        priority: 'medium',
        status: 'pending',
        latitude: -25.7479,
        longitude: 28.2293,
        address: 'Menlyn Maine, 250 Bancor Ave, Pretoria, 0181',
        contactName: 'Alex Thompson',
        contactPhone: '+27126789012',
        scheduledStartTime: new Date(Date.now() + 14400000), // 4 hours from now
        estimatedDuration: 60,
        orderNumber: 'MNT-001',
        notes: 'Full service required',
      },
    }),
  ]);

  console.log('✅ Created tasks:', tasks.length);

  // Create Routes
  console.log('🛣️ Creating routes...');

  const route1 = await prisma.route.create({
    data: {
      name: 'Morning Delivery Route - North',
      description:
        'Standard morning delivery route covering northern Johannesburg suburbs',
      status: 'active',
      vehicleId: vehicles[0].id,
      userId: driver1.id,
      startLatitude: -26.195,
      startLongitude: 28.034,
      startAddress: 'Distribution Center - Johannesburg CBD',
      endLatitude: -26.195,
      endLongitude: 28.034,
      endAddress: 'Distribution Center - Johannesburg CBD',
      scheduledStartTime: new Date(Date.now() + 3600000),
      totalDistance: 45.5,
      estimatedDuration: 180, // 3 hours
      isOptimized: true,
      optimizationMetric: 'time',
      totalTasks: 3,
      completedTasks: 0,
    },
  });

  // Link tasks to route 1
  await Promise.all([
    prisma.routeTask.create({
      data: {
        routeId: route1.id,
        taskId: tasks[0].id, // Sandton
        sequence: 1,
      },
    }),
    prisma.routeTask.create({
      data: {
        routeId: route1.id,
        taskId: tasks[1].id, // Rosebank
        sequence: 2,
      },
    }),
    prisma.routeTask.create({
      data: {
        routeId: route1.id,
        taskId: tasks[2].id, // Midrand
        sequence: 3,
      },
    }),
  ]);

  const route2 = await prisma.route.create({
    data: {
      name: 'Afternoon Express Route',
      description: 'Afternoon express delivery and urgent pickups',
      status: 'in_progress',
      vehicleId: vehicles[1].id,
      userId: driver2.id,
      startLatitude: -26.195,
      startLongitude: 28.034,
      startAddress: 'Distribution Center - Johannesburg CBD',
      endLatitude: -26.195,
      endLongitude: 28.034,
      endAddress: 'Distribution Center - Johannesburg CBD',
      scheduledStartTime: new Date(Date.now() - 1800000), // 30 min ago
      actualStartTime: new Date(Date.now() - 1500000),
      totalDistance: 32.8,
      estimatedDuration: 120, // 2 hours
      isOptimized: true,
      optimizationMetric: 'distance',
      totalTasks: 1,
      completedTasks: 0,
    },
  });

  await prisma.routeTask.create({
    data: {
      routeId: route2.id,
      taskId: tasks[3].id, // Fourways (in progress)
      sequence: 1,
    },
  });

  await prisma.route.create({
    data: {
      name: 'Evening Route - Draft',
      description: 'Planned evening route for next shift',
      status: 'draft',
      scheduledStartTime: new Date(Date.now() + 21600000), // 6 hours from now
      totalDistance: 0,
      estimatedDuration: 0,
      isOptimized: false,
      totalTasks: 0,
      completedTasks: 0,
    },
  });

  console.log('✅ Created routes:', 3);

  // Print summary
  const userCount = await prisma.user.count();
  const vehicleCount = await prisma.vehicle.count();
  const taskCount = await prisma.task.count();
  const routeCount = await prisma.route.count();
  const routeTaskCount = await prisma.routeTask.count();

  console.log('\n📊 Seed Summary:');
  console.log('================');
  console.log(`✓ Users: ${userCount}`);
  console.log(`✓ Vehicles: ${vehicleCount}`);
  console.log(`✓ Tasks: ${taskCount}`);
  console.log(`✓ Routes: ${routeCount}`);
  console.log(`✓ Route-Task links: ${routeTaskCount}`);

  console.log('\n🔐 Login Credentials:');
  console.log('====================');
  console.log('Admin:  admin@fleet.com / Admin123!');
  console.log('Driver: driver1@fleet.com / Driver123!');
  console.log('Driver: driver2@fleet.com / Driver123!');
  console.log('Viewer: viewer@fleet.com / Viewer123!');

  console.log('\n🌍 Sample Locations:');
  console.log('===================');
  console.log('• Sandton City: -26.1076, 28.0567');
  console.log('• Rosebank: -26.1473, 28.0407');
  console.log('• Midrand: -25.9950, 28.1290');
  console.log('• Fourways: -26.0125, 28.0055');
  console.log('• Woodmead: -26.0733, 28.0957');

  console.log('\n✅ Database seeded successfully! 🎉\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
