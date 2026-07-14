"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function completeOnboarding(data: {
  role: string;
  projectName: string;
  projectDescription: string;
  memberCount: number;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

    try {
    const projectId = randomUUID();
    const orgId = randomUUID();
    
    await prisma.$transaction(async (tx) => {
      // Create a default role if it doesn't exist
      const adminRole = await tx.role.findFirst({ where: { name: "Admin" } }) || 
                        await tx.role.create({ data: { name: "Admin" } });

      // 1. Create a new organization for the onboarding user
      await tx.organization.create({
        data: {
          id: orgId,
          name: `${data.projectName} Organization`,
          slug: `${data.projectName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${randomUUID().slice(0, 8)}`,
          members: {
            create: {
              userId,
              roleId: adminRole.id,
            }
          }
        }
      });

      // 2. Create the project linked to the organization
      await tx.project.create({
        data: {
          id: projectId,
          organizationId: orgId,
          name: data.projectName,
          description: data.projectDescription,
          status: "ACTIVE",
          members: {
            create: {
              userId: userId,
              role: "OWNER",
            }
          }
        }
      });
    });

    return { success: true, projectId };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return { success: false, error: "Failed to save onboarding data." };
  }
}
