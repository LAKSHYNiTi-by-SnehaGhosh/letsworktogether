"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getUserDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [activeProjects, tasks] = await Promise.all([
    prisma.project.count({
      where: {
        status: "ACTIVE",
        organization: {
          members: {
            some: { userId }
          }
        }
      },
    }),
    prisma.task.findMany({
      where: { assigneeId: userId },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const tasksCompleted = tasks.filter(t => t.status === "DONE").length;
  const recentActivities = tasks.slice(0, 3);

  return { activeProjects, tasksCompleted, recentActivities };
}

export async function getUserTasks() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return prisma.task.findMany({
    where: { assigneeId: userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProjectTasks(projectId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return prisma.task.findMany({
    where: { 
      projectId: projectId,
      project: {
        organization: {
          members: {
            some: { userId }
          }
        }
      }
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getUserProjects() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return prisma.project.findMany({
    where: {
      OR: [
        { organization: { members: { some: { userId } } } },
        { members: { some: { userId } } }
      ]
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { members: true, tasks: true }
      }
    }
  });
}

export async function getProjectMilestones(projectId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return prisma.milestone.findMany({
    where: { projectId },
    orderBy: { dueDate: "asc" }
  });
}

export async function getProjectMembers(projectId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return prisma.projectMember.findMany({
    where: { projectId },
    include: { user: { include: { profile: true } } }
  });
}

export async function getProjectDetails(projectId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return prisma.project.findUnique({
    where: { id: projectId },
    include: { 
      milestones: true, 
      members: { include: { user: { include: { profile: true } } } } 
    }
  });
}

export async function getProjectAnalytics(projectId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  const [totalTasks, completedTasks, milestones, submissions] = await Promise.all([
    prisma.task.count({ where: { projectId } }),
    prisma.task.count({ where: { projectId, status: "DONE" } }),
    prisma.milestone.findMany({ where: { projectId }, include: { tasks: true } }),
    prisma.taskSubmission.count({ where: { task: { projectId } } })
  ]);
  
  return { totalTasks, completedTasks, milestones, submissions };
}

export async function getUserPendingInvitations() {
  const { userId } = await auth();
  if (!userId) return [];
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.email) return [];
  
  return prisma.projectInvitation.findMany({
    where: { 
      email: {
        equals: user.email,
        mode: "insensitive"
      },
      status: "PENDING"
    },
    include: {
      project: true
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getProjectInvitations(projectId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return prisma.projectInvitation.findMany({
    where: { projectId, status: "PENDING" },
    orderBy: { createdAt: "desc" }
  });
}
