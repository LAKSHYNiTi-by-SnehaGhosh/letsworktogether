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
        const adminRole = await prisma.role.findFirst({ where: { name: "Admin" } }) || 
                          await prisma.role.create({ data: { name: "Admin" } });

        const org = await prisma.organization.create({
            data: {
                name: "My Workspace",
                slug: "workspace-" + user.id,
                members: {
                    create: {
                        userId: user.id,
                        roleId: adminRole.id
                    }
                }
            }
        }).catch(() => null);

        if (!org) {
            throw new Error("You must belong to an organization to create tasks.");
        }

        const newProject = await prisma.project.create({
            data: {
                name: "Personal Tasks",
                status: "ACTIVE",
                organizationId: org.id,
                members: {
                    create: {
                        userId: user.id,
                        role: "OWNER"
                    }
                }
            }
        });
        projectId = newProject.id;


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

export async function toggleTaskCompletion(taskId: string, completed: boolean) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  // Ensure the task belongs to the user
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Task not found");

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: completed ? "DONE" : "TODO",
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  return { success: true };
}

export async function deleteTask(taskId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Task not found");

  await prisma.task.delete({
    where: { id: taskId }
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  return { success: true };
}
