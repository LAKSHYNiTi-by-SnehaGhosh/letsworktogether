import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // In a real implementation with Stripe, we would create a Stripe Checkout Session here
    // and redirect the user to Stripe. Since Stripe is postponed, we will just 
    // upgrade the user immediately for testing purposes.

    await prisma.user.update({
      where: { email: clerkUser.emailAddresses[0].emailAddress },
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
