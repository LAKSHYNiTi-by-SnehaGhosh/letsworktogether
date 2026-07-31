import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key-please-change-in-production"
);

async function verifyAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("lwt_admin_token")?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return !!payload?.adminId;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized admin request" }, { status: 401 });
    }

    const body = await req.json();
    const { taskId, action, status, priority } = body;

    if (!taskId) {
      return NextResponse.json({ error: "taskId is required" }, { status: 400 });
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (action === "toggle_status") {
      const newStatus = task.status === "DONE" ? "TODO" : "DONE";
      const updated = await prisma.task.update({
        where: { id: taskId },
        data: { status: newStatus },
      });
      return NextResponse.json({ success: true, task: updated });
    }

    if (action === "update_priority" && priority) {
      const updated = await prisma.task.update({
        where: { id: taskId },
        data: { priority },
      });
      return NextResponse.json({ success: true, task: updated });
    }

    if (action === "delete_task") {
      await prisma.task.update({
        where: { id: taskId },
        data: { deletedAt: new Date() },
      });
      return NextResponse.json({ success: true, message: "Task deleted by admin" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("[ADMIN_TASKS_POST]", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
