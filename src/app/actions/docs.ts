"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getDocuments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get all documents for projects the user has access to
  return prisma.document.findMany({
    where: {
      project: {
        OR: [
          { organization: { members: { some: { userId } } } },
          { members: { some: { userId } } }
        ]
      }
    },
    orderBy: { updatedAt: "desc" },
    include: {
      project: { select: { name: true } },
      author: { select: { profile: true } }
    }
  });
}

export async function createDocument(data: { projectId: string; title: string; content?: string; type: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return prisma.document.create({
    data: {
      ...data,
      authorId: userId
    }
  });
}
