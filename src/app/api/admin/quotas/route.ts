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
    const { userId, action, aiTotalLimit, subscriptionPlan } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "reset_usage") {
      await prisma.user.update({
        where: { id: userId },
        data: { aiUsageCount: 0, aiUsageResetDate: new Date() },
      });
      return NextResponse.json({ success: true, message: "AI Usage Count reset to 0." });
    }

    if (action === "update_plan" && subscriptionPlan) {
      let defaultLimit = 50;
      if (subscriptionPlan === "PRO") defaultLimit = 500;
      if (subscriptionPlan === "ENTERPRISE") defaultLimit = 5000;

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionPlan,
          aiTotalLimit: aiTotalLimit ? parseInt(aiTotalLimit) : defaultLimit,
        },
      });
      return NextResponse.json({ success: true, message: `Subscription plan updated to ${subscriptionPlan}` });
    }

    if (action === "update_limit" && aiTotalLimit !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: { aiTotalLimit: parseInt(aiTotalLimit) },
      });
      return NextResponse.json({ success: true, message: `AI Limit updated to ${aiTotalLimit}` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("[ADMIN_QUOTAS_POST]", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
