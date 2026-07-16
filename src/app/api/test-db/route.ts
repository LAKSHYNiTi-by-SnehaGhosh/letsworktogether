import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await prisma.backendAdmin.findFirst();
    return NextResponse.json({ success: true, admin: admin ? "Exists" : "None" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Unknown error", stack: error?.stack }, { status: 200 });
  }
}
