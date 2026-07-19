import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await prisma.backendAdmin.findFirst();
    return NextResponse.json({ success: true, admin: admin ? "Exists" : "None" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({ success: false, error: errorMessage, stack: errorStack }, { status: 200 });
  }
}
