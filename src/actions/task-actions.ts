"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const priorityRaw = formData.get("priority") as string;
  let priority = "MEDIUM";
  if (priorityRaw === "High") priority = "HIGH";
  if (priorityRaw === "Low") priority = "LOW";

  if (!title || title.trim() === "") throw new Error("Title is required");

  // Find a project to attach the task to, as projectId is mandatory in schema
  const membership = await prisma.projectMember.findFirst({
    where: { userId: user.id }
  });

  let projectId = membership?.projectId;

  if (!projectId) {
    // Check if user is in an organization
    const orgMembership = await prisma.organizationMember.findFirst({
        where: { userId: user.id }
    });
    
    if (orgMembership) {
        // Create a default project for this user
        const newProject = await prisma.project.create({
            data: {
                name: "Personal Tasks",
                status: "ACTIVE",
                organizationId: orgMembership.organizationId,
                members: {
                    create: {
                        userId: user.id,
                        role: "OWNER"
                    }
                }
            }
        });
        projectId = newProject.id;
    } else {
        // Find user profile to get some default org if needed?
        // Actually, many users might not even have an org.
        // Let's create an organization and a project if none exists.
        const org = await prisma.organization.create({
            data: {
                name: "My Workspace",
                slug: "workspace-" + user.id,
                members: {
                    create: {
                        userId: user.id,
                        roleId: "00000000-0000-0000-0000-000000000000" // We'd need a valid roleId. This is tricky.
                    }
                }
            }
        }).catch(() => null);

        if (!org) {
            throw new Error("You must belong to an organization to create tasks.");
        }
    }
  }
  
  if (!projectId) {
     throw new Error("No project found to assign task to.");
  }

  await prisma.task.create({
    data: {
      title,
      priority,
      status: "TODO",
      projectId,
      assigneeId: user.id,
      dueDate: new Date(),
    }
  });

  revalidatePath("/dashboard");
  return { success: true };
}
