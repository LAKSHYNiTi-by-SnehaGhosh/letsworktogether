import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const persona = searchParams.get("persona");
    const projectId = searchParams.get("projectId");

    if (!persona) return new NextResponse("Missing persona", { status: 400 });

    const memories = await prisma.aIPersonaMemory.findMany({
      where: {
        userId,
        persona,
        projectId: projectId || null,
      },
      orderBy: { createdAt: "asc" },
      take: 50, // Get last 50 messages to prevent giant payloads
    });

    return NextResponse.json({ memories });
  } catch (error) {
    console.error("[AI_MEMORY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
