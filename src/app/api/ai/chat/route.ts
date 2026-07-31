import { requireUser } from "@/lib/auth-sync";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";
import { revalidatePath } from "next/cache";
import { ensureDefaultProjectForUser } from "@/actions/task-actions";
import { checkAndIncrementAIQuota } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const userId = await requireUser();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { persona, projectId, message } = body;

    if (!persona || !message) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Store User Message
    await prisma.aIPersonaMemory.create({
      data: {
        userId,
        projectId: projectId || null,
        persona,
        role: "user",
        content: message,
      },
    });

    // Enforce AI Quotas & Rate Limits
    const quotaCheck = await checkAndIncrementAIQuota(userId, `AI_CHAT_${persona}`);
    if (!quotaCheck.allowed) {
      const limitMsg = await prisma.aIPersonaMemory.create({
        data: {
          userId,
          projectId: projectId || null,
          persona,
          role: "assistant",
          content: `⚠️ ${quotaCheck.error}`,
        },
      });
      return NextResponse.json({ response: limitMsg, error: quotaCheck.error, isRateLimited: true });
    }

    // Fetch previous context
    const pastMemories = await prisma.aIPersonaMemory.findMany({
      where: { userId, persona, projectId: projectId || null },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    // Fetch user context for PM tools
    let userContextStr = "";
    if (persona === "PM") {
      const orgs = await prisma.organizationMember.findMany({
        where: { userId },
        include: { organization: true },
      });
      const orgList = orgs.map((o) => ({ id: o.organizationId, name: o.organization.name }));

      const projects = await prisma.projectMember.findMany({
        where: { userId },
        include: { project: true },
      });
      const projectList = projects.map((p) => ({
        id: p.projectId,
        name: p.project.name,
        organizationId: p.project.organizationId,
      }));

      const activeTasks = await prisma.task.findMany({
        where: { assigneeId: userId, deletedAt: null, status: { not: "DONE" } },
        orderBy: { updatedAt: "desc" },
        take: 15,
      });
      const taskList = activeTasks.map((t) => ({ id: t.id, title: t.title, status: t.status }));

      userContextStr = `\nUser Context:\nAvailable Organizations (ID: Name): ${JSON.stringify(
        orgList
      )}\nAvailable Projects (ID: Name): ${JSON.stringify(
        projectList
      )}\nUser's Active Tasks (ID: Title): ${JSON.stringify(
        taskList
      )}\nCurrent Project ID (if any): ${projectId || "None"}\n`;
    }

    // Build persona system prompt
    let systemPrompt = "You are a helpful AI assistant.";
    if (persona === "PM") {
      systemPrompt = `You are a strict, highly effective AI Project Manager. You MUST NOT answer random gossip or engage in small talk. You exist to manage projects, tasks, to-do lists, topics, and team productivity. When the user asks you to add a task, topic, reminder, or to-do item (e.g., "Add a task...", "To-do list e add koro...", "Add topic..."), YOU MUST CALL the "create_task" tool immediately. You do not need a specific projectId—if not specified, leave it empty and the system will automatically assign it to the user's default workspace. When asked to update, complete, check off, or delete a task, use "update_task" or "delete_task". ${userContextStr}`;
    } else if (persona === "HR") {
      systemPrompt = "You are an AI HR Representative. Keep responses welcoming, empathetic, and brief.";
    } else if (persona === "TECH_LEAD") {
      systemPrompt = "You are an AI Tech Lead. Focus on code quality, architecture, and brief technical advice.";
    }

    const messages: any = [
      { role: "system", content: systemPrompt },
      ...pastMemories.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];

    const tools: any =
      persona === "PM"
        ? [
            {
              type: "function",
              function: {
                name: "create_task",
                description:
                  "Create a new task or to-do list item for the user. Call this whenever the user asks to add a task, topic, goal, or reminder.",
                parameters: {
                  type: "object",
                  properties: {
                    title: { type: "string", description: "Title or summary of the task" },
                    description: {
                      type: "string",
                      description: "Detailed description, topic, or notes for the task",
                    },
                    status: {
                      type: "string",
                      enum: ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"],
                      description: "Initial status of the task. Defaults to TODO",
                    },
                    priority: {
                      type: "string",
                      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
                      description: "Priority of the task. Defaults to MEDIUM",
                    },
                    projectId: {
                      type: "string",
                      description:
                        "Optional UUID of the project. If not provided or invalid, the system automatically uses the user's default project.",
                    },
                  },
                  required: ["title"],
                },
              },
            },
            {
              type: "function",
              function: {
                name: "create_project",
                description: "Create a new project.",
                parameters: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "Name of the project" },
                    description: { type: "string", description: "Description of the project" },
                    organizationId: {
                      type: "string",
                      description: "The UUID of the organization. Infer from User Context.",
                    },
                  },
                  required: ["name"],
                },
              },
            },
            {
              type: "function",
              function: {
                name: "update_task",
                description:
                  "Update an existing task (change status e.g. DONE/TODO, title, or priority).",
                parameters: {
                  type: "object",
                  properties: {
                    taskId: {
                      type: "string",
                      description: "The UUID or title of the task to update",
                    },
                    title: { type: "string", description: "Optional title or task name search" },
                    status: {
                      type: "string",
                      enum: ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"],
                    },
                    priority: {
                      type: "string",
                      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
                    },
                  },
                },
              },
            },
            {
              type: "function",
              function: {
                name: "delete_task",
                description: "Delete a task from the user's to-do list.",
                parameters: {
                  type: "object",
                  properties: {
                    taskId: {
                      type: "string",
                      description: "The UUID or title of the task to delete",
                    },
                    title: { type: "string", description: "Optional title of task to delete" },
                  },
                },
              },
            },
          ]
        : undefined;

    let chatCompletion = await groq.chat.completions.create({
      messages,
      model: persona === "PM" ? "llama-3.3-70b-versatile" : "llama3-8b-8192",
      tools: tools,
      tool_choice: tools ? "auto" : undefined,
    });

    let aiResponse = chatCompletion.choices[0]?.message?.content || "";
    const toolCalls = chatCompletion.choices[0]?.message?.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      messages.push(chatCompletion.choices[0].message);

      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        let result = "";

        try {
          if (functionName === "create_task") {
            let targetProjectId = args.projectId;

            // Validate targetProjectId if provided
            if (targetProjectId) {
              const proj = await prisma.project.findUnique({ where: { id: targetProjectId } });
              if (!proj) targetProjectId = null;
            }

            if (!targetProjectId && projectId) {
              const proj = await prisma.project.findUnique({ where: { id: projectId } });
              if (proj) targetProjectId = projectId;
            }

            if (!targetProjectId) {
              targetProjectId = await ensureDefaultProjectForUser(userId);
            }

            const task = await prisma.task.create({
              data: {
                projectId: targetProjectId,
                title: args.title.trim(),
                description: args.description ? args.description.trim() : null,
                status: args.status || "TODO",
                priority: args.priority || "MEDIUM",
                assigneeId: userId,
                dueDate: new Date(),
              },
            });
            result = `Task "${task.title}" created successfully!`;
          } else if (functionName === "create_project") {
            let orgId = args.organizationId;
            if (!orgId) {
              const orgMem = await prisma.organizationMember.findFirst({ where: { userId } });
              orgId = orgMem?.organizationId;
            }

            if (!orgId) {
              const newOrg = await prisma.organization.create({
                data: {
                  name: "My Organization",
                  slug: `org-${userId.slice(0, 6)}-${Date.now()}`,
                },
              });
              orgId = newOrg.id;
            }

            const project = await prisma.project.create({
              data: {
                organizationId: orgId,
                name: args.name,
                description: args.description || null,
                status: "ACTIVE",
                members: {
                  create: {
                    userId: userId,
                    role: "OWNER",
                  },
                },
              },
            });
            result = `Project "${project.name}" created successfully!`;
          } else if (functionName === "update_task") {
            let targetTask: any = null;
            if (args.taskId) {
              targetTask = await prisma.task.findFirst({
                where: { id: args.taskId, deletedAt: null },
              });
            }

            if (!targetTask && (args.title || args.taskId)) {
              const searchStr = args.title || args.taskId;
              targetTask = await prisma.task.findFirst({
                where: {
                  assigneeId: userId,
                  deletedAt: null,
                  title: { contains: searchStr, mode: "insensitive" },
                },
              });
            }

            if (!targetTask) {
              result = `Task not found.`;
            } else {
              const updateData: any = {};
              if (args.status) updateData.status = args.status;
              if (args.priority) updateData.priority = args.priority;
              if (args.title) updateData.title = args.title.trim();

              const updated = await prisma.task.update({
                where: { id: targetTask.id },
                data: updateData,
              });
              result = `Task "${updated.title}" updated to status ${updated.status}.`;
            }
          } else if (functionName === "delete_task") {
            let targetTask: any = null;
            if (args.taskId) {
              targetTask = await prisma.task.findFirst({
                where: { id: args.taskId, deletedAt: null },
              });
            }

            if (!targetTask && (args.title || args.taskId)) {
              const searchStr = args.title || args.taskId;
              targetTask = await prisma.task.findFirst({
                where: {
                  assigneeId: userId,
                  deletedAt: null,
                  title: { contains: searchStr, mode: "insensitive" },
                },
              });
            }

            if (!targetTask) {
              result = `Task not found to delete.`;
            } else {
              await prisma.task.update({
                where: { id: targetTask.id },
                data: { deletedAt: new Date() },
              });
              result = `Task "${targetTask.title}" deleted successfully.`;
            }
          }
        } catch (err: any) {
          result = `Error executing ${functionName}: ${err.message}`;
          console.error("[AI_TOOL_ERROR]", err);
        }

        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: result,
        });
      }

      const secondCompletion = await groq.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
      });
      aiResponse =
        secondCompletion.choices[0]?.message?.content || "I have completed the requested task action.";

      // Revalidate dashboard paths
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/tasks");
    }

    if (!aiResponse) {
      aiResponse = "I'm having trouble processing that.";
    }

    // Store AI Response
    const newMemory = await prisma.aIPersonaMemory.create({
      data: {
        userId,
        projectId: projectId || null,
        persona,
        role: "assistant",
        content: aiResponse,
      },
    });

    return NextResponse.json({ response: newMemory });
  } catch (error) {
    console.error("[AI_CHAT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
