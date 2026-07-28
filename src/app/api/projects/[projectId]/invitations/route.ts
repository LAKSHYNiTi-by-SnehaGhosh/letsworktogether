import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import {
  inviteMemberToProject,
  cancelProjectInvitation,
  resendProjectInvitation,
} from "@/app/actions/projects";

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

    const invitations = await prisma.projectInvitation.findMany({
      where: { projectId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, invitations });
  } catch (error: any) {
    console.error("GET /api/projects/[projectId]/invitations Error:", error);
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
    const { action, email, role, message, invitationId } = body;

    if (action === "INVITE") {
      const res = await inviteMemberToProject(projectId, email, role, message);
      if (!res.success) {
        return NextResponse.json(res, { status: 400 });
      }
      return NextResponse.json(res);
    }

    if (action === "CANCEL") {
      const res = await cancelProjectInvitation(invitationId);
      if (!res.success) {
        return NextResponse.json(res, { status: 400 });
      }
      return NextResponse.json(res);
    }

    if (action === "RESEND") {
      const res = await resendProjectInvitation(invitationId);
      if (!res.success) {
        return NextResponse.json(res, { status: 400 });
      }
      return NextResponse.json(res);
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/projects/[projectId]/invitations Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
