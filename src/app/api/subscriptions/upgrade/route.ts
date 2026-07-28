import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureUserSynced } from "@/lib/user-sync";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Ensure database user exists before upgrading
    await ensureUserSynced(clerkUser);

    await prisma.user.update({
      where: { id: clerkUser.id },
      data: {
        subscriptionPlan: "PRO",
        aiTotalLimit: 1000000 // practically unlimited for PRO
      }
    });

    return NextResponse.redirect(new URL("/dashboard/billing", req.url));
  } catch (error) {
    console.error("Upgrade error:", error);
    return NextResponse.redirect(new URL("/dashboard/billing?error=upgrade_failed", req.url));
  }
}
