import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { updateProjectMemberRole, removeProjectMember } from "@/app/actions/projects";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          include: { profile: true }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    return NextResponse.json({ success: true, members });
  } catch (error: any) {
    console.error("GET /api/projects/[projectId]/members Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const body = await req.json();
    const { action, targetUserId, role } = body;

    if (action === "UPDATE_ROLE") {
      const res = await updateProjectMemberRole(projectId, targetUserId, role);
      if (!res.success) {
        return NextResponse.json(res, { status: 400 });
      }
      return NextResponse.json(res);
    }

    if (action === "REMOVE_MEMBER") {
      const res = await removeProjectMember(projectId, targetUserId);
      if (!res.success) {
        return NextResponse.json(res, { status: 400 });
      }
      return NextResponse.json(res);
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/projects/[projectId]/members Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
