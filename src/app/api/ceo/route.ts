import { requireUser } from "@/lib/auth-sync";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const userId = await requireUser();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) return new NextResponse("Project ID required", { status: 400 });

    // Enforce strict RBAC: only OWNER can access CEO dashboard
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId }
      }
    });

    if (!membership || membership.role !== "OWNER") {
      return new NextResponse("Forbidden: CEO access only", { status: 403 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: true,
        milestones: true
      }
    });

    if (!project) return new NextResponse("Project not found", { status: 404 });

    const health = project.status === "ACTIVE" ? "Healthy" : project.status;
    
    // Mock executive overview data based on real records
    return NextResponse.json({
      roadmap: project.milestones,
      budget: { spent: 45000, allocated: 100000 },
      projectHealth: health,
      risks: [
        "Dependencies on external APIs",
        "Upcoming deadline for Sprint 4"
      ],
      aiInsights: "The team is operating at 85% capacity. Velocity has increased by 10% this week.",
      clientFeedback: "Very positive response to the latest dashboard update."
    });
  } catch (error) {
    console.error("[CEO_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
