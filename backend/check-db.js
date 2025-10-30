const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('\n🔍 Checking database...\n');

  const users = await prisma.user.count();
  const vehicles = await prisma.vehicle.count();
  const tasks = await prisma.task.count();
  const routes = await prisma.route.count();

  console.log('📊 Database Statistics:');
  console.log('======================');
  console.log(`Users:     ${users}`);
  console.log(`Vehicles:  ${vehicles}`);
  console.log(`Tasks:     ${tasks}`);
  console.log(`Routes:    ${routes}`);
  
  if (users > 0) {
    console.log('\n👤 Sample Users:');
    const userList = await prisma.user.findMany({
      select: { email: true, role: true, firstName: true, lastName: true }
    });
    userList.forEach(u => {
      console.log(`  ${u.role.padEnd(10)} | ${u.email.padEnd(25)} | ${u.firstName} ${u.lastName}`);
    });
  }

  console.log('\n✅ Database check complete!\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
