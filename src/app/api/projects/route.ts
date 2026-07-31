import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { requireUser } from "@/lib/auth-sync";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requireUser();

    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status") || "ALL";
    const includeArchived = searchParams.get("includeArchived") === "true";

    // Build Prisma query condition
    // User can see project if:
    // 1. User is a direct ProjectMember
    // 2. User is an OrganizationMember of project's Organization
    // 3. User is a TeamMember of project's Team
    const userAccessCondition = {
      OR: [
        { members: { some: { userId } } },
        { organization: { members: { some: { userId } } } },
        { team: { members: { some: { userId } } } },
      ],
    };

    // Filter by status if requested
    const whereCondition: any = {
      deletedAt: null,
      ...userAccessCondition,
    };

    if (statusFilter !== "ALL") {
      whereCondition.status = statusFilter;
    } else if (!includeArchived) {
      // Exclude archived by default in ALL view if not specifically included
      whereCondition.status = { not: "ARCHIVED" };
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      whereCondition.AND = [
        {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
      ];
    }

    const rawProjects = await prisma.project.findMany({
      where: whereCondition,
      orderBy: { updatedAt: "desc" },
      include: {
        organization: {
          select: { id: true, name: true, slug: true },
        },
        team: {
          select: { id: true, name: true },
        },
        members: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        tasks: {
          select: {
            id: true,
            status: true,
            priority: true,
            dueDate: true,
          },
        },
        milestones: {
          orderBy: { createdAt: "desc" },
          include: {
            tasks: {
              select: { id: true, status: true },
            },
          },
        },
        aiMemories: {
          select: { id: true, persona: true, createdAt: true },
          take: 5,
        },
      },
    });

    const projects = rawProjects.map((p) => {
      const totalTasks = p.tasks.length;
      const completedTasks = p.tasks.filter((t) => t.status === "DONE").length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Find user role in project
      const directMember = p.members.find((m) => m.userId === userId);
      const userRole = directMember ? directMember.role : "MEMBER";

      // Current sprint / milestone summary
      const activeMilestone = p.milestones.find((m) => m.status === "ACTIVE") || p.milestones[0];
      let sprintSummary = "No active sprint";
      if (activeMilestone) {
        const mTasks = activeMilestone.tasks.length;
        const mDone = activeMilestone.tasks.filter((t) => t.status === "DONE").length;
        sprintSummary = `${activeMilestone.title} (${mDone}/${mTasks} done)`;
      }

      // AI PM status
      const hasAiMemory = p.aiMemories.length > 0;
      const aiPmStatus = {
        active: hasAiMemory || p.milestones.length > 0,
        personaCount: p.aiMemories.length,
        label: hasAiMemory ? "AI PM Active" : p.milestones.length > 0 ? "Sprint Ready" : "AI PM Ready",
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
        members: p.members.map((m) => ({
          id: m.id,
          userId: m.userId,
          role: m.role,
          name: m.user.profile ? `${m.user.profile.firstName} ${m.user.profile.lastName}`.trim() : m.user.email,
          email: m.user.email,
          avatarUrl: m.user.profile?.avatarUrl || null,
        })),
        progress,
        totalTasks,
        completedTasks,
        sprintSummary,
        aiPmStatus,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    return NextResponse.json({ projects, count: projects.length }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requireUser();

    const body = await req.json();
    const { name, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const projectId = randomUUID();

    // Ensure user has an organization
    let userOrg = await prisma.organizationMember.findFirst({
      where: { userId },
    });

    if (!userOrg) {
      let adminRole = await prisma.role.findFirst({ where: { name: "Admin" } });
      if (!adminRole) {
        adminRole = await prisma.role.create({ data: { name: "Admin" } });
      }

      const defaultOrg = await prisma.organization.create({
        data: {
          name: "My Organization",
          slug: `org-${userId}-${Date.now()}`,
          members: {
            create: {
              userId,
              roleId: adminRole.id,
            },
          },
        },
      });

      userOrg = {
        id: "new",
        organizationId: defaultOrg.id,
        userId,
        roleId: adminRole.id,
        joinedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
    }

    const newProject = await prisma.project.create({
      data: {
        id: projectId,
        name: name.trim(),
        description: description ? description.trim() : "",
        organizationId: userOrg.organizationId,
        status: "ACTIVE",
        members: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
      include: {
        organization: { select: { id: true, name: true } },
        members: { select: { id: true, userId: true, role: true } },
      },
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
  }
}
