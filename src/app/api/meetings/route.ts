import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    // We can fetch meetings from MentorSession as a proxy, or just return an empty array if we don't have a generic meetings table.
    // For now, let's fetch active MentorSessions for the user
    
    const mentorSessions = await prisma.mentorSession.findMany({
      where: {
        request: {
          OR: [
            { studentId: userId },
            { mentor: { userId: userId } }
          ],
          ...(projectId ? { projectId } : {})
        },
        status: { in: ["SCHEDULED", "IN_PROGRESS"] }
      },
      include: {
        request: {
          include: {
            student: { select: { profile: true } },
            mentor: { include: { user: { select: { profile: true } } } }
          }
        }
      },
      orderBy: { startTime: "asc" }
    });

    return NextResponse.json(mentorSessions);
  } catch (error) {
    console.error("[MEETINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
