import { requireUser } from "@/lib/auth-sync";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

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
      const orgList = orgs.map(o => ({ id: o.organizationId, name: o.organization.name }));
      
      const projects = await prisma.projectMember.findMany({
        where: { userId },
        include: { project: true },
      });
      const projectList = projects.map(p => ({ id: p.projectId, name: p.project.name, organizationId: p.project.organizationId }));

      userContextStr = `\nUser Context:\nAvailable Organizations (ID: Name): ${JSON.stringify(orgList)}\nAvailable Projects (ID: Name): ${JSON.stringify(projectList)}\nCurrent Project ID (if any): ${projectId || 'None'}\n`;
    }

    // Build persona system prompt
    let systemPrompt = "You are a helpful AI assistant.";
    if (persona === "PM") {
      systemPrompt = `You are a strict, highly professional AI Project Manager. You MUST NOT answer random questions, gossip, or engage in small talk. You exist ONLY to manage projects, tasks, and team productivity. Be extremely concise, direct, and actionable. When the user asks you to add a task or create a project, YOU MUST USE THE PROVIDED TOOLS to update the database directly. DO NOT just say you will do it—actually call the tool. ${userContextStr}`;
    } else if (persona === "HR") {
      systemPrompt = "You are an AI HR Representative. Keep responses welcoming, empathetic, and brief.";
    } else if (persona === "TECH_LEAD") {
      systemPrompt = "You are an AI Tech Lead. Focus on code quality, architecture, and brief technical advice.";
    }

    const messages: any = [
      { role: "system", content: systemPrompt },
      ...pastMemories.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];

    const tools: any = persona === "PM" ? [
      {
        type: "function",
        function: {
          name: "create_task",
          description: "Create a new task in a project.",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string", description: "Title of the task" },
              description: { type: "string", description: "Detailed description of the task" },
              status: { type: "string", enum: ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"], description: "Current status of the task. Default to TODO" },
              priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "URGENT"], description: "Priority of the task. Default to MEDIUM" },
              projectId: { type: "string", description: "The UUID of the project. If not provided, try to infer from User Context." }
            },
            required: ["title", "status", "priority", "projectId"],
          }
        }
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
              organizationId: { type: "string", description: "The UUID of the organization. Infer from User Context." }
            },
            required: ["name", "organizationId"],
          }
        }
      }
    ] : undefined;

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
            const task = await prisma.task.create({
              data: {
                projectId: args.projectId,
                title: args.title,
                description: args.description || null,
                status: args.status || "TODO",
                priority: args.priority || "MEDIUM",
              }
            });
            result = `Task created successfully with ID: ${task.id}`;
          } else if (functionName === "create_project") {
            const project = await prisma.project.create({
              data: {
                organizationId: args.organizationId,
                name: args.name,
                description: args.description || null,
                status: "ACTIVE",
                members: {
                  create: {
                    userId: userId,
                    role: "OWNER"
                  }
                }
              }
            });
            result = `Project created successfully with ID: ${project.id}`;
          }
        } catch (err: any) {
          result = `Error executing ${functionName}: ${err.message}`;
          console.error(err);
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
      aiResponse = secondCompletion.choices[0]?.message?.content || "I have completed the requested action.";
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
