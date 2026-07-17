import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key-please-change-in-production"
);

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("lwt_admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/adminpanel/login", req.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
    } catch {
      return NextResponse.redirect(new URL("/adminpanel/login", req.url));
    }

    const formData = await req.formData();
    const mentorId = formData.get("mentorId") as string;
    const action = formData.get("action") as string; // APPROVE or REJECT

    if (action === "APPROVE") {
      await prisma.mentorProfile.update({
        where: { id: mentorId },
        data: { approvalStatus: "APPROVED", isVerified: true }
      });
    } else if (action === "REJECT") {
      await prisma.mentorProfile.update({
        where: { id: mentorId },
        data: { approvalStatus: "REJECTED", isVerified: false }
      });
    }

    return NextResponse.redirect(new URL("/adminpanel/database/marketplace", req.url));
  } catch (error) {
    console.error("Admin mentor action error:", error);
    return NextResponse.redirect(new URL("/adminpanel/database/marketplace?error=action_failed", req.url));
  }
}
