import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("Starting database cleanup...");

  try {
    // Clear Tasks
    console.log("Deleting tasks...");
    const taskResult = await prisma.task.deleteMany();
    console.log(`Deleted ${taskResult.count} tasks.`);

    // Clear Projects
    console.log("Deleting projects...");
    const projectResult = await prisma.project.deleteMany();
    console.log(`Deleted ${projectResult.count} projects.`);

    console.log("Database cleared successfully!");
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
