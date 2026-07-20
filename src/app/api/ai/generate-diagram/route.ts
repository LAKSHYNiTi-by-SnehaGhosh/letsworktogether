import { requireUser } from "@/lib/auth-sync";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const userId = await requireUser();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new NextResponse("Missing prompt", { status: 400 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemPrompt = `You are an expert AI Architect and Project Manager. 
    The user is using an interactive whiteboard and needs you to generate a diagram or structured plan.
    Output ONLY raw valid Markdown. If drawing a diagram, use Mermaid syntax inside \`\`\`mermaid \`\`\` blocks.
    Be concise, structured, and highly professional. Do not include introductory or concluding conversational text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      model: "llama3-8b-8192",
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "";

    return NextResponse.json({ content: aiResponse });
  } catch (error) {
    console.error("[AI_DIAGRAM_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
