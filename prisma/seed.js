const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function main() {
  // Hash password
  const password = await bcrypt.hash('password123', 10);

  // Admin user
  await prisma.user.upsert({
    where: { email: 'admin@junkrik.com' },
    update: {},
    create: {
      email: 'admin@junkrik.com',
      password,
      businessName: 'Junkrik Admin',
      address: 'Jl. Admin No. 1',
      phone: '081234567890',
      role: 'admin',
    },
  });

  // Bisnis user
  await prisma.user.upsert({
    where: { email: 'bisnis@junkrik.com' },
    update: {},
    create: {
      email: 'bisnis@junkrik.com',
      password,
      businessName: 'Restoran Sukses',
      address: 'Jl. Bisnis No. 2',
      phone: '081298765432',
      role: 'business',
      wasteType: 'PLASTIC',
      wasteVolume: 50,
    },
  });

    await prisma.user.upsert({
    where: { email: 'driver@junkrik.com' },
    update: {},
    create: {
      email: 'driver@junkrik.com',
      password,
      businessName: 'Driver Junkrik',
      address: 'Jl. Driver No. 3',
      phone: '081211112222',
      role: 'driver',
    },
  });

  console.log('Seeder selesai: admin & bisnis user dibuat.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
