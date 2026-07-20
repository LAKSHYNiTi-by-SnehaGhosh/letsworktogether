import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const user = await prisma.user.findUnique({
      where: { id: clerkUser.id },
      include: { mentorProfile: true }
    });

    if (!user || !user.mentorProfile) {
      return NextResponse.redirect(new URL("/dashboard/mentors", req.url));
    }

    const formData = await req.formData();
    const requestId = formData.get("requestId") as string;
    const action = formData.get("action") as string; // ACCEPT or REJECT

    const request = await prisma.mentorRequest.findUnique({
      where: { id: requestId }
    });

    if (!request || request.mentorId !== user.mentorProfile.id) {
      return NextResponse.redirect(new URL("/dashboard/mentor-dashboard?error=not_found", req.url));
    }

    if (action === "REJECT") {
      await prisma.mentorRequest.update({
        where: { id: requestId },
        data: { status: "REJECTED" }
      });
      // In a real application, release the Stripe hold here.
    } else if (action === "ACCEPT") {
      await prisma.mentorRequest.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" }
      });

      // Create a session
      await prisma.mentorSession.create({
        data: {
          requestId: requestId,
          status: "SCHEDULED"
        }
      });
      
      // In a real application, capture the Stripe hold here and create a mentor transaction.
    }

    return NextResponse.redirect(new URL("/dashboard/mentor-dashboard?success=action_completed", req.url));
  } catch (error) {
    console.error("Mentor action error:", error);
    return NextResponse.redirect(new URL("/dashboard/mentor-dashboard?error=action_failed", req.url));
  }
}
