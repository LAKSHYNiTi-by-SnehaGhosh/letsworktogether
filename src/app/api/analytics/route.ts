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

    if (!projectId) return new NextResponse("Project ID required", { status: 400 });

    const totalTasks = await prisma.task.count({ where: { projectId } });
    const completedTasks = await prisma.task.count({ where: { projectId, status: "DONE" } });
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return NextResponse.json({
      totalTasks,
      completedTasks,
      progress,
      velocity: completedTasks * 2, // arbitrary mock multiplier for points
      repositoryHealth: progress > 80 ? "Excellent" : progress > 50 ? "Good" : "Needs Attention"
    });
  } catch (error) {
    console.error("[ANALYTICS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
