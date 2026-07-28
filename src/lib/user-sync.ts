import { User as ClerkUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function ensureUserSynced(clerkUser: ClerkUser | null) {
  if (!clerkUser) return null;

  const id = clerkUser.id;
  const primaryEmail = clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0
    ? clerkUser.emailAddresses[0].emailAddress
    : "";
  const firstName = clerkUser.firstName || "";
  const lastName = clerkUser.lastName || "";
  const avatarUrl = clerkUser.imageUrl || "";

  try {
    // 1. Check if user already exists by ID
    let user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true }
    });

    // 2. If not found by ID, check if user exists by primary email
    if (!user && primaryEmail) {
      user = await prisma.user.findUnique({
        where: { email: primaryEmail },
        include: { profile: true }
      });
    }

    // 3. If user still doesn't exist, create a new record
    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            id,
            email: primaryEmail || `${id}@clerk.local`,
            subscriptionPlan: "FREE",
            aiTotalLimit: 50,
            aiUsageCount: 0
          },
          include: { profile: true }
        });
      } catch (createError) {
        console.error("Conflict or error creating user record:", createError);
        // Secondary fallback query
        user = await prisma.user.findFirst({
          where: {
            OR: [
              { id },
              { email: primaryEmail }
            ]
          },
          include: { profile: true }
        });
      }
    }

    // 4. Ensure Profile is populated
    if (user) {
      try {
        await prisma.profile.upsert({
          where: { userId: user.id },
          update: {
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            avatarUrl: avatarUrl || undefined
          },
          create: {
            userId: user.id,
            firstName,
            lastName,
            avatarUrl
          }
        });
      } catch (profileError) {
        console.error("Error upserting profile:", profileError);
      }
    }

    return user;
  } catch (error) {
    console.error("Critical error in ensureUserSynced for Clerk user:", id, error);
    return null;
  }
}
