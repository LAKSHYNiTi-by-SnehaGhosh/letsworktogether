"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function createProject(data: {
  name: string;
  description: string;
}) {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    throw new Error("Unauthorized");
  }
  const userId = clerkUser.id;
  const email = clerkUser.emailAddresses[0]?.emailAddress || "";

  try {
    const projectId = randomUUID();
    
    // Ensure the user exists in our database
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: email,
      }
    });

    // Fix: We need an organization ID. If none, grab the first one the user is part of.
    let userOrg = await prisma.organizationMember.findFirst({
      where: { userId }
    });

    if (!userOrg) {
      // Create a default role if it doesn't exist
      const adminRole = await prisma.role.findFirst({ where: { name: "Admin" } }) || 
                        await prisma.role.create({ data: { name: "Admin" } });

      // Create a default organization for the user
      const defaultOrg = await prisma.organization.create({
        data: {
          name: "My Organization",
          slug: `org-${userId}`,
          members: {
            create: {
              userId,
              roleId: adminRole.id,
            }
          }
        }
      });
      userOrg = { organizationId: defaultOrg.id, userId, roleId: adminRole.id, id: "new", joinedAt: new Date(), createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
    }

    // We can use a transaction to create project and update user's linked project
    await prisma.$transaction(async (tx) => {
      await tx.project.create({
        data: {
          id: projectId,
          name: data.name,
          description: data.description,
          organizationId: userOrg.organizationId,
          status: "ACTIVE",
          members: {
            create: {
              userId,
              role: "OWNER"
            }
          }
        },
      });
    });

    return { success: true, projectId };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project." };
  }
}

export async function joinProject(projectId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role: "MEMBER"
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Error joining project:", error);
    return { success: false, error: "Failed to join project" };
  }
}

export async function updateProjectStatus(projectId: string, status: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  // Verify ownership or admin
  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: { projectId, userId }
    }
  });

  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
    throw new Error("Unauthorized to change project status");
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { status }
  });

  return { success: true };
}
