import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: 'Admin', email: 'admin@coffee.com', password: 'Admin@123', role: Role.ADMIN },
    { name: 'Manager', email: 'manager@coffee.com', password: 'Manager@123', role: Role.MANAGER },
    { name: 'User', email: 'user@coffee.com', password: 'User@1234', role: Role.USER },
  ];
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, password: await bcrypt.hash(u.password, 10) },
    });
  }
  if ((await prisma.product.count()) === 0) {
    await prisma.product.createMany({
      data: [
        { name: 'Espresso', title: 'Rich & bold', description: 'Double shot espresso', price: 3.5 },
        { name: 'Latte', title: 'Smooth & creamy', description: 'Espresso with steamed milk', price: 4.75 },
      ],
    });
  }
}

main().finally(() => prisma.$disconnect());
