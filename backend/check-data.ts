import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('\n🔍 Checking database...\n');

    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, firstName: true, lastName: true }
    });

    const vehicles = await prisma.vehicle.findMany({
      select: { id: true, name: true, licensePlate: true, type: true, status: true }
    });

    const tasks = await prisma.task.findMany({
      select: { id: true, title: true, type: true, priority: true, status: true }
    });

    const routes = await prisma.route.findMany({
      select: { id: true, name: true, status: true, totalTasks: true }
    });

    console.log('📊 Database Statistics:');
    console.log('======================');
    console.log(`Users:     ${users.length}`);
    console.log(`Vehicles:  ${vehicles.length}`);
    console.log(`Tasks:     ${tasks.length}`);
    console.log(`Routes:    ${routes.length}`);

    console.log('\n👤 Users:');
    console.log('=========');
    users.forEach(u => {
      console.log(`  ${u.role.padEnd(10)} | ${u.email.padEnd(25)} | ${u.firstName} ${u.lastName}`);
    });

    console.log('\n🚗 Vehicles:');
    console.log('===========');
    vehicles.forEach(v => {
      console.log(`  ${v.licensePlate.padEnd(15)} | ${v.name.padEnd(20)} | ${v.type.padEnd(10)} | ${v.status}`);
    });

    console.log('\n📋 Tasks:');
    console.log('=========');
    tasks.forEach(t => {
      console.log(`  ${t.title.substring(0, 30).padEnd(32)} | ${t.type.padEnd(12)} | ${t.priority.padEnd(8)} | ${t.status}`);
    });

    console.log('\n🛣️  Routes:');
    console.log('==========');
    routes.forEach(r => {
      console.log(`  ${r.name.padEnd(30)} | ${r.status.padEnd(12)} | ${r.totalTasks} tasks`);
    });

    console.log('\n🔐 Login Credentials:');
    console.log('====================');
    console.log('Admin:  admin@fleet.com / Admin123!');
    console.log('Driver: driver1@fleet.com / Driver123!');
    console.log('Driver: driver2@fleet.com / Driver123!');
    console.log('Viewer: viewer@fleet.com / Viewer123!');

    console.log('\n✅ Database verification complete!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
