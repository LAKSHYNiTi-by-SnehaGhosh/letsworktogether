import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Build a quick summary string or data object for the HR persona to present
    const unreadNotifications = await prisma.notification.count({
      where: { userId, readAt: null }
    });

    const pendingTasks = await prisma.task.count({
      where: { assigneeId: userId, status: { not: "DONE" } }
    });

    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysMeetings = await prisma.mentorSession.count({
      where: {
        startTime: { gte: today, lt: tomorrow },
        request: {
          OR: [
            { studentId: userId },
            { mentor: { userId: userId } }
          ]
        }
      }
    });

    return NextResponse.json({
      briefing: `Welcome back! You have ${unreadNotifications} unread notifications, ${pendingTasks} pending tasks, and ${todaysMeetings} meetings scheduled for today.`
    });
  } catch (error) {
    console.error("[HR_BRIEFING_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
