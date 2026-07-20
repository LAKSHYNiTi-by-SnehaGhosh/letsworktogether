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

    if (!projectId) {
      return new NextResponse("Project ID required", { status: 400 });
    }

    const documents = await prisma.document.findMany({
      where: { projectId },
      orderBy: { updatedAt: "desc" },
      include: {
        author: { select: { profile: { select: { firstName: true, lastName: true } } } }
      }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("[DOCUMENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
