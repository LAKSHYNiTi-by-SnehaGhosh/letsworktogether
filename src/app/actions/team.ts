"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getTeamMembers() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get user's org
  let userOrg = await prisma.organizationMember.findFirst({
    where: { userId },
    include: {
      organization: {
        include: {
          members: {
            include: {
              user: {
                include: { profile: true }
              },
              role: true
            }
          }
        }
      }
    }
  });

  const members = [];
  
  if (userOrg) {
    for (const mem of userOrg.organization.members) {
      // Calculate tasks completed
      const tasksCompleted = await prisma.task.count({
        where: { assigneeId: mem.userId, status: "DONE" }
      });
      
      members.push({
        id: mem.userId,
        name: mem.user.profile ? `${mem.user.profile.firstName} ${mem.user.profile.lastName}` : "User",
        role: mem.role.name,
        isAi: false,
        status: "Online",
        tasksCompleted,
        rating: 4.8, // static for now
      });
    }
  } else {
    // Just return self if no org
    const tasksCompleted = await prisma.task.count({
      where: { assigneeId: userId, status: "DONE" }
    });
    members.push({
      id: userId,
      name: "You",
      role: "User",
      isAi: false,
      status: "Online",
      tasksCompleted,
      rating: 4.5,
    });
  }

  // Add our AI team members
  members.push({
    id: "ai-1",
    name: "Gemini 1.5 Pro",
    role: "Senior Software Architect",
    isAi: true,
    status: "Online",
    tasksCompleted: 142,
    rating: 4.9,
  });

  members.push({
    id: "ai-2",
    name: "Claude 3.5 Sonnet",
    role: "Lead UI/UX Designer",
    isAi: true,
    status: "Online",
    tasksCompleted: 89,
    rating: 4.8,
  });

  return members;
}
