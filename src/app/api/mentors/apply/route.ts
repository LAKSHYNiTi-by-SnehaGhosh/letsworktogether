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

    // Check if profile exists
    const existingProfile = await prisma.mentorProfile.findUnique({
      where: { userId: user.id }
    });

    if (existingProfile) {
      return NextResponse.redirect(new URL("/dashboard/mentors", req.url));
    }

    // Create a pending mentor profile
    await prisma.mentorProfile.create({
      data: {
        userId: user.id,
        title: "Software Engineer", // Default for now
        bio: "I am a passionate software engineer looking to help students.",
        skills: ["React", "Node.js", "TypeScript"],
        yearsOfExperience: 3,
        hourlyRate: 500,
        approvalStatus: "PENDING",
        isVerified: false
      }
    });

    return NextResponse.redirect(new URL("/dashboard/mentors?applied=true", req.url));
  } catch (error) {
    console.error("Apply error:", error);
    return NextResponse.redirect(new URL("/dashboard/mentors?error=apply_failed", req.url));
  }
}
