import { requireUser } from "@/lib/auth-sync";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ taskId: string }> }) {
  try {
    const userId = await requireUser();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { taskId } = await params;
    const body = await req.json();
    const { action, status } = body; // action could be 'update_status'

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) return new NextResponse("Not Found", { status: 404 });
    if (task.assigneeId !== userId) return new NextResponse("Unauthorized", { status: 401 });

    if (action === "update_status" && status) {
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { status },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId,
          action: `TASK_STATUS_UPDATED`,
          entityType: "TASK",
          entityId: taskId,
          metadata: { newStatus: status, oldStatus: task.status },
        }
      });

      return NextResponse.json(updatedTask);
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch (error) {
    console.error("[TASK_ACTION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
