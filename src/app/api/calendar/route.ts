import { requireUser } from "@/lib/auth-sync";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const userId = await requireUser();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    // Fetch Milestones and MentorSessions for a combined calendar
    const milestones = await prisma.milestone.findMany({
      where: projectId ? { projectId } : {},
      orderBy: { dueDate: "asc" }
    });

    const sessions = await prisma.mentorSession.findMany({
      where: {
        request: {
          OR: [
            { studentId: userId },
            { mentor: { userId: userId } }
          ],
          ...(projectId ? { projectId } : {})
        }
      },
      orderBy: { startTime: "asc" }
    });

    return NextResponse.json({
      milestones,
      sessions
    });
  } catch (error) {
    console.error("[CALENDAR_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
