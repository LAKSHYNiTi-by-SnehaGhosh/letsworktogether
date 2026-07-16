import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const username = process.argv[3];
  const password = process.argv[4];

  if (!email || !username || !password) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> <username> <password>");
    process.exit(1);
  }

  if (!email.endsWith("@lakshyniti.com")) {
    console.error("Error: Admin email must end with @lakshyniti.com");
    process.exit(1);
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.backendAdmin.create({
      data: {
        email,
        username,
        passwordHash,
      },
    });

    console.log(`Successfully created LWT Backend Admin: ${admin.username} (${admin.email})`);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
