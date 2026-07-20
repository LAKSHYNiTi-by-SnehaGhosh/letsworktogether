import { requireUser } from "@/lib/auth-sync";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userId = await requireUser();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const project = await prisma.project.findFirst({
      where: {
        OR: [
          { organization: { members: { some: { userId } } } },
          { members: { some: { userId } } }
        ]
      },
      orderBy: { updatedAt: 'desc' }
    });

    if (!project) {
      return NextResponse.json({ projectId: null });
    }

    return NextResponse.json({ projectId: project.id });
  } catch (error) {
    console.error("[PROJECTS_FIRST_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
