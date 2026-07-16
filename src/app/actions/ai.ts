"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

const DAILY_LIMIT = 5;

export async function generateSprintForProject(projectId: string, prompt: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set.");
  }

  // Rate Limiting Logic
  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiUsageCount: true, aiUsageResetDate: true }
  });

  if (!userRecord) throw new Error("User not found in DB");

  const now = new Date();
  let currentUsage = userRecord.aiUsageCount;
  let resetDate = userRecord.aiUsageResetDate;

  // If reset date is empty or from a previous day (comparing YYYY-MM-DD)
  if (!resetDate || resetDate.toDateString() !== now.toDateString()) {
    currentUsage = 0;
    resetDate = now;
  }

  if (currentUsage >= DAILY_LIMIT) {
    return { success: false, error: "Your daily AI usage limit is over. Please try again tomorrow." };
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  // Verify the user has access to this project
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { organization: { members: { some: { userId } } } },
        { members: { some: { userId } } }
      ]
    }
  });

  if (!project) throw new Error("Project not found or unauthorized");

  const systemPrompt = `You are an expert AI Project Manager. The user is creating a sprint or project plan for the following project:
Name: ${project.name}
Description: ${project.description || 'No description provided'}

User's Request: ${prompt}

Generate a structured response in JSON format. The JSON should have the following structure:
{
  "milestones": [
    {
      "title": "Milestone Title",
      "description": "Brief description",
      "tasks": [
        {
          "title": "Task Title",
          "description": "Task details",
          "priority": "HIGH" // LOW, MEDIUM, HIGH, URGENT
        }
      ]
    }
  ]
}

Only output valid JSON.`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: systemPrompt
        }
      ],
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      response_format: { type: "json_object" }
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    
    // Save generated milestones and tasks to the database
    if (data.milestones && Array.isArray(data.milestones)) {
      for (const m of data.milestones) {
        const milestone = await prisma.milestone.create({
          data: {
            projectId: project.id,
            title: m.title,
            description: m.description,
            status: "PENDING"
          }
        });

        if (m.tasks && Array.isArray(m.tasks)) {
          for (const t of m.tasks) {
            await prisma.task.create({
              data: {
                projectId: project.id,
                milestoneId: milestone.id,
                title: t.title,
                description: t.description,
                priority: t.priority || "MEDIUM",
                status: "TODO"
              }
            });
          }
        }
      }
    }

    // Increment Usage after success
    await prisma.user.update({
      where: { id: userId },
      data: {
        aiUsageCount: currentUsage + 1,
        aiUsageResetDate: resetDate
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { success: false, error: error.message || "Failed to generate sprint" };
  }
}
