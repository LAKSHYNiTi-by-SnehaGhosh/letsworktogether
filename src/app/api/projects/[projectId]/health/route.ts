import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Await params first to satisfy Next.js 15+ dynamic route requirements
    const projectId = (await params).projectId;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { organization: { members: { some: { userId } } } },
          { members: { some: { userId } } }
        ]
      },
      include: {
        tasks: true
      }
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    const tasks = project.tasks;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "DONE").length;
    
    const now = new Date();
    const overdueTasks = tasks.filter((t) => {
      return t.status !== "DONE" && t.dueDate && t.dueDate < now;
    }).length;

    let health = "Healthy";
    
    if (totalTasks > 0) {
      const overdueRatio = overdueTasks / totalTasks;
      const completionRatio = completedTasks / totalTasks;

      if (completionRatio === 1) {
        health = "Completed";
      } else if (overdueRatio > 0.4) {
        health = "Critical";
      } else if (overdueRatio > 0.2) {
        health = "At Risk";
      } else if (project.status === "ON_HOLD") {
        health = "At Risk";
      }
    }

    return NextResponse.json({
      health,
      metrics: {
        totalTasks,
        completedTasks,
        overdueTasks
      }
    });
  } catch (error) {
    console.error("[PROJECT_HEALTH_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
