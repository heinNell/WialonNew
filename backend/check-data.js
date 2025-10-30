const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const vehicles = await prisma.vehicle.count();
  const tasks = await prisma.task.count();
  const routes = await prisma.route.count();
  
  console.log('\n📊 Database Statistics:');
  console.log('======================');
  console.log(`Users:     ${users}`);
  console.log(`Vehicles:  ${vehicles}`);
  console.log(`Tasks:     ${tasks}`);
  console.log(`Routes:    ${routes}`);
  console.log('\n✅ Data loaded successfully!\n');
  
  console.log('🔐 Login Credentials:');
  console.log('Admin:  admin@fleet.com / Admin123!');
  console.log('Driver: driver1@fleet.com / Driver123!');
  console.log('Viewer: viewer@fleet.com / Viewer123!\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
