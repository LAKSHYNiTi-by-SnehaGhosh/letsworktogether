import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const userExists = await prisma.user.findUnique({ 
    where: { id: userId },
    select: { id: true }
  });
  
  if (!userExists) {
    const clerkUser = await currentUser();
    if (clerkUser) {
      const email = clerkUser.emailAddresses[0]?.emailAddress || "";
      await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email,
        }
      });
      // also create profile to prevent relations failing
      await prisma.profile.upsert({
        where: { userId },
        update: {},
        create: {
          userId,
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
          avatarUrl: clerkUser.imageUrl || "",
        }
      });
    }
  }
  return userId;
}
