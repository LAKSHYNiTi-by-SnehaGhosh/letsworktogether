import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
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

    // Build persona system prompt
    let systemPrompt = "You are a helpful AI assistant.";
    if (persona === "PM") {
      systemPrompt = "You are an expert AI Project Manager. Keep responses extremely brief and actionable.";
    } else if (persona === "HR") {
      systemPrompt = "You are an AI HR Representative. Keep responses welcoming, empathetic, and brief.";
    } else if (persona === "TECH_LEAD") {
      systemPrompt = "You are an AI Tech Lead. Focus on code quality, architecture, and brief technical advice.";
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...pastMemories.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "llama3-8b-8192",
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "I'm having trouble processing that.";

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
