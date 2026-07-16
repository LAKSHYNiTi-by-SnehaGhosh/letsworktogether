"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getUserAnalytics() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get all completed tasks for the user
  const completedTasks = await prisma.task.findMany({
    where: { assigneeId: userId, status: "DONE" },
    orderBy: { updatedAt: "asc" }
  });

  const totalTasks = await prisma.task.count({
    where: { assigneeId: userId }
  });

  // Basic XP logic: 50 XP per completed task
  const totalXp = completedTasks.length * 50;
  
  // Calculate Level (Level 1 starts at 0 XP, Level 2 at 200 XP, etc.)
  const currentLevel = Math.max(1, Math.floor(totalXp / 200) + 1);

  // Sprint Velocity: Tasks completed in the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const velocity = completedTasks.filter(
    (t) => t.updatedAt >= sevenDaysAgo
  ).length;

  // Accuracy: (Completed Tasks / Total Tasks) * 100
  const accuracy = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Calculate XP progression for the last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  let cumulativeXp = 0;
  // Calculate historical baseline XP before the last 7 days
  const priorTasks = completedTasks.filter(t => t.updatedAt < new Date(last7Days[0]));
  cumulativeXp = priorTasks.length * 50;

  const chartData = last7Days.map(dateStr => {
    // find tasks completed on this day
    const dayTasks = completedTasks.filter(t => t.updatedAt.toISOString().split('T')[0] === dateStr);
    cumulativeXp += dayTasks.length * 50;
    
    // Format date string for label (e.g. "Mon", "Tue")
    const dateObj = new Date(dateStr);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });

    return {
      name: dayName,
      xp: cumulativeXp
    };
  });

  return {
    totalXp,
    currentLevel,
    velocity,
    accuracy,
    chartData
  };
}
