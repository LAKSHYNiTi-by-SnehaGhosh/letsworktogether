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
  if (!projectId) return [];
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, organizationId: true }
    });

    if (!project) return [];

    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          include: { profile: true }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    return members;
  } catch (error) {
    console.error("Error fetching project members:", error);
    return [];
  }
}

export async function getProjectDetails(projectId: string) {
  if (!projectId) return null;
  try {
    const { userId } = await auth();
    if (!userId) return null;

    return await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        milestones: true,
        members: { include: { user: { include: { profile: true } } } },
        organization: true
      }
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    return null;
  }
}

export async function getProjectAnalytics(projectId: string) {
  const { userId } = await auth();
  if (!userId) return { totalTasks: 0, completedTasks: 0, milestones: [], submissions: 0 };
  
  try {
    const [totalTasks, completedTasks, milestones, submissions] = await Promise.all([
      prisma.task.count({ where: { projectId } }),
      prisma.task.count({ where: { projectId, status: "DONE" } }),
      prisma.milestone.findMany({ where: { projectId }, include: { tasks: true } }),
      prisma.taskSubmission.count({ where: { task: { projectId } } })
    ]);
    
    return { totalTasks, completedTasks, milestones, submissions };
  } catch (error) {
    console.error("Error fetching project analytics:", error);
    return { totalTasks: 0, completedTasks: 0, milestones: [], submissions: 0 };
  }
}

export async function getUserPendingInvitations() {
  try {
    const { userId } = await auth();
    if (!userId) return [];
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.email) return [];
    
    return await prisma.projectInvitation.findMany({
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
  } catch (error) {
    console.error("Error fetching user pending invitations:", error);
    return [];
  }
}

export async function getProjectInvitations(projectId: string) {
  if (!projectId) return [];
  try {
    const { userId } = await auth();
    if (!userId) return [];

    return await prisma.projectInvitation.findMany({
      where: { projectId, status: "PENDING" },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching project invitations:", error);
    return [];
  }
}
