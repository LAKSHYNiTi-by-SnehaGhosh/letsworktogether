import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { requireUser } from "@/lib/auth-sync";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    if (!projectId) {
      return NextResponse.json({ success: false, error: "Project ID is required" }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        deletedAt: null,
        OR: [
          { members: { some: { userId } } },
          { organization: { members: { some: { userId } } } },
          { team: { members: { some: { userId } } } },
        ],
      },
      include: {
        organization: { select: { id: true, name: true, slug: true } },
        team: { select: { id: true, name: true } },
        members: {
          include: {
            user: { include: { profile: true } },
          },
        },
        milestones: {
          orderBy: { dueDate: "asc" },
          include: { tasks: true },
        },
        tasks: {
          orderBy: { createdAt: "desc" },
          include: { assignee: { include: { profile: true } } },
        },
        _count: {
          select: { members: true, tasks: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("GET /api/projects/[projectId] error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const body = await req.json();
    const { name, description, status } = body;

    // Check authorization: User must be OWNER or ADMIN in project
    const member = await prisma.projectMember.findFirst({
      where: { projectId, userId },
    });

    if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized to update project settings" }, { status: 403 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });

    return NextResponse.json({ success: true, project: updatedProject }, { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/projects/[projectId] error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    // Verify ownership
    const member = await prisma.projectMember.findFirst({
      where: { projectId, userId },
    });

    if (!member || member.role !== "OWNER") {
      return NextResponse.json({ success: false, error: "Only project owner can delete this project" }, { status: 403 });
    }

    // Soft delete by setting deletedAt
    await prisma.project.update({
      where: { id: projectId },
      data: { deletedAt: new Date(), status: "ARCHIVED" },
    });

    return NextResponse.json({ success: true, message: "Project deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/projects/[projectId] error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to delete project" }, { status: 500 });
  }
}
