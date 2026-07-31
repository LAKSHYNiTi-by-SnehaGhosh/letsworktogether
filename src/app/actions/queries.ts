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
    where: {
      assigneeId: userId,
      deletedAt: null,
    },
    include: {
      project: {
        select: { id: true, name: true }
      }
    },
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

  const rawProjects = await prisma.project.findMany({
    where: {
      deletedAt: null,
      OR: [
        { members: { some: { userId } } },
        { organization: { members: { some: { userId } } } },
        { team: { members: { some: { userId } } } }
      ]
    },
    orderBy: { updatedAt: "desc" },
    include: {
      organization: { select: { id: true, name: true, slug: true } },
      team: { select: { id: true, name: true } },
      members: {
        include: {
          user: { include: { profile: true } }
        }
      },
      tasks: { select: { id: true, status: true, priority: true } },
      milestones: {
        orderBy: { createdAt: "desc" },
        include: { tasks: { select: { id: true, status: true } } }
      },
      aiMemories: { select: { id: true, persona: true }, take: 5 },
      _count: { select: { members: true, tasks: true } }
    }
  });

  return rawProjects.map(p => {
    const totalTasks = p.tasks.length;
    const completedTasks = p.tasks.filter(t => t.status === "DONE").length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const directMember = p.members.find(m => m.userId === userId);
    const userRole = directMember ? directMember.role : "MEMBER";

    const activeMilestone = p.milestones.find(m => m.status === "ACTIVE") || p.milestones[0];
    let sprintSummary = "No active sprint";
    if (activeMilestone) {
      const mTasks = activeMilestone.tasks.length;
      const mDone = activeMilestone.tasks.filter(t => t.status === "DONE").length;
      sprintSummary = `${activeMilestone.title} (${mDone}/${mTasks} done)`;
    }

    const hasAiMemory = p.aiMemories.length > 0;
    const aiPmStatus = {
      active: hasAiMemory || p.milestones.length > 0,
      personaCount: p.aiMemories.length,
      label: hasAiMemory ? "AI PM Active" : p.milestones.length > 0 ? "Sprint Ready" : "AI PM Ready"
    };

    return {
      id: p.id,
      name: p.name,
      description: p.description || "",
      status: p.status || "ACTIVE",
      organization: p.organization ? { id: p.organization.id, name: p.organization.name } : null,
      team: p.team ? { id: p.team.id, name: p.team.name } : null,
      userRole,
      membersCount: p.members.length,
      members: p.members.map(m => ({
        id: m.id,
        userId: m.userId,
        role: m.role,
        name: m.user.profile ? `${m.user.profile.firstName} ${m.user.profile.lastName}`.trim() : m.user.email,
        email: m.user.email,
        avatarUrl: m.user.profile?.avatarUrl || null
      })),
      progress,
      totalTasks,
      completedTasks,
      sprintSummary,
      aiPmStatus,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      _count: p._count
    };
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

    let project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        milestones: true,
        members: { include: { user: { include: { profile: true } } } },
        organization: {
          include: {
            members: true
          }
        }
      }
    });

    if (!project) return null;

    // Auto-heal: If project exists but has zero members in projectMember table,
    // add current user as OWNER so project page and member management work seamlessly.
    if (project.members.length === 0) {
      try {
        await prisma.projectMember.create({
          data: {
            projectId,
            userId,
            role: "OWNER"
          }
        });
        project = await prisma.project.findUnique({
          where: { id: projectId },
          include: {
            milestones: true,
            members: { include: { user: { include: { profile: true } } } },
            organization: {
              include: {
                members: true
              }
            }
          }
        });
      } catch (e) {
        console.error("Auto-heal project member error:", e);
      }
    }

    return project;
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
