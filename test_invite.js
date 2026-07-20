require("dotenv").config({ path: ".env.local" });
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", users.map(u => u.email));

  const projects = await prisma.project.findMany();
  console.log("Projects:", projects.map(p => ({ id: p.id, name: p.name })));

  const members = await prisma.projectMember.findMany();
  console.log("Project members:", members);
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
