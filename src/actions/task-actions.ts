"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function ensureDefaultProjectForUser(userId: string): Promise<string> {
  // 1. Check if user is a member of any project
  const member = await prisma.projectMember.findFirst({
    where: { userId },
    select: { projectId: true },
  });
  if (member?.projectId) return member.projectId;

  // 2. Check if user has an organization
  const orgMember = await prisma.organizationMember.findFirst({
    where: { userId },
    select: { organizationId: true },
  });

  let orgId = orgMember?.organizationId;

  if (!orgId) {
    let adminRole = await prisma.role.findFirst({ where: { name: "Admin" } });
    if (!adminRole) {
      adminRole = await prisma.role.create({ data: { name: "Admin" } });
    }

    const newOrg = await prisma.organization.create({
      data: {
        name: "My Workspace",
        slug: `workspace-${userId.slice(0, 8)}-${Date.now()}`,
        members: {
          create: {
            userId,
            roleId: adminRole.id,
          },
        },
      },
    });
    orgId = newOrg.id;
  }

  // 3. Create "Personal Tasks" project under orgId
  const newProject = await prisma.project.create({
    data: {
      name: "Personal Tasks",
      description: "Default project for personal tasks and to-do items",
      status: "ACTIVE",
      organizationId: orgId,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });

  return newProject.id;
}

export async function createTask(input: FormData | {
  title: string;
  description?: string;
  priority?: string;
  projectId?: string;
  dueDate?: string;
}) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  let title = "";
  let description = "";
  let priority = "MEDIUM";
  let projectId = "";
  let dueDate: Date | null = null;

  if (input instanceof FormData) {
    title = (input.get("title") as string) || "";
    description = (input.get("description") as string) || "";
    const pRaw = input.get("priority") as string;
    if (pRaw) {
      const pUpper = pRaw.toUpperCase();
      if (["LOW", "MEDIUM", "HIGH", "URGENT"].includes(pUpper)) priority = pUpper;
    }
    projectId = (input.get("projectId") as string) || "";
    const dueRaw = input.get("dueDate") as string;
    if (dueRaw) dueDate = new Date(dueRaw);
  } else {
    title = input.title || "";
    description = input.description || "";
    if (input.priority) {
      const pUpper = input.priority.toUpperCase();
      if (["LOW", "MEDIUM", "HIGH", "URGENT"].includes(pUpper)) priority = pUpper;
    }
    projectId = input.projectId || "";
    if (input.dueDate) dueDate = new Date(input.dueDate);
  }

  if (!title || title.trim() === "") throw new Error("Task title is required");

  // Validate or assign projectId
  if (projectId) {
    const projExists = await prisma.project.findUnique({ where: { id: projectId } });
    if (!projExists) projectId = "";
  }

  if (!projectId) {
    projectId = await ensureDefaultProjectForUser(user.id);
  }

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description.trim() || null,
      priority,
      status: "TODO",
      projectId,
      assigneeId: user.id,
      dueDate: dueDate || new Date(),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  return { success: true, task };
}

export async function updateTask(taskId: string, data: {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  projectId?: string;
  dueDate?: string | null;
}) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing || existing.deletedAt) throw new Error("Task not found");

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.description !== undefined) updateData.description = data.description.trim() || null;
  if (data.priority !== undefined) {
    const pUpper = data.priority.toUpperCase();
    if (["LOW", "MEDIUM", "HIGH", "URGENT"].includes(pUpper)) updateData.priority = pUpper;
  }
  if (data.status !== undefined) {
    const sUpper = data.status.toUpperCase();
    if (["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"].includes(sUpper)) updateData.status = sUpper;
  }
  if (data.projectId) {
    updateData.projectId = data.projectId;
  }
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  return { success: true, task };
}

export async function toggleTaskCompletion(taskId: string, completed: boolean) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.deletedAt) throw new Error("Task not found");

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: completed ? "DONE" : "TODO",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  return { success: true, task: updated };
}

export async function deleteTask(taskId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Task not found");

  // Soft delete task
  await prisma.task.update({
    where: { id: taskId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  return { success: true };
}

export async function clearCompletedTasks() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.task.updateMany({
    where: {
      assigneeId: user.id,
      status: "DONE",
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  return { success: true };
}
