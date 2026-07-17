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
      where: { email: clerkUser.emailAddresses[0].emailAddress }
    });

    if (!user) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    const formData = await req.formData();
    const mentorId = formData.get("mentorId") as string;
    const problemStatement = formData.get("problemStatement") as string;
    const requiredExpertiseRaw = formData.get("requiredExpertise") as string;
    const projectId = formData.get("projectId") as string;
    const hourlyRate = parseFloat(formData.get("hourlyRate") as string);

    const requiredExpertise = requiredExpertiseRaw.split(",").map(s => s.trim()).filter(s => s);

    // Create the request
    await prisma.mentorRequest.create({
      data: {
        studentId: user.id,
        mentorId: mentorId,
        projectId: projectId || null,
        problemStatement,
        requiredExpertise,
        budget: hourlyRate,
        status: "PENDING"
      }
    });

    // In a real application, we would also pre-authorize the payment via Stripe here

    return NextResponse.redirect(new URL("/dashboard/mentors?success=request_sent", req.url));
  } catch (error) {
    console.error("Mentor request error:", error);
    return NextResponse.redirect(new URL("/dashboard/mentors?error=request_failed", req.url));
  }
}
