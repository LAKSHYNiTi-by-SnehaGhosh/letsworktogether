import { prisma } from "./prisma";
import Groq from "groq-sdk";

// Ensure the API Key is set in your .env file as GROQ_API_KEY
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateTextWithUsageTracking(userId: string, prompt: string) {
  try {
    // 1. Fetch user and check limits
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found for AI usage tracking.");
    }

    // Auto-renew quota if it's past the reset date (e.g., a new month)
    const now = new Date();
    if (user.aiUsageResetDate && now > user.aiUsageResetDate) {
      // Reset usage to 0 and push date forward 30 days
      const nextReset = new Date();
      nextReset.setDate(nextReset.getDate() + 30);
      
      await prisma.user.update({
        where: { id: userId },
        data: {
          aiUsageCount: 0,
          aiUsageResetDate: nextReset,
        },
      });
      user.aiUsageCount = 0;
    }

    // Check Limit
    if (user.aiUsageCount >= user.aiTotalLimit) {
      const errorMsg = `You have reached your AI usage limit for the ${user.subscriptionPlan} plan (${user.aiTotalLimit} requests). Please upgrade to a paid package to continue using AI.`;
      
      // Log this limitation hit
      await prisma.systemErrorLog.create({
        data: {
          errorType: "AI_LIMIT_REACHED",
          message: `User ${userId} reached their AI limit of ${user.aiTotalLimit}.`,
        }
      });

      return { success: false, error: errorMsg, isRateLimited: true };
    }

    // 2. Call the Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192", // Using a fast/standard groq model
    });

    const text = chatCompletion.choices[0]?.message?.content || "";

    // 3. Increment Usage and Log
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { aiUsageCount: { increment: 1 } },
      }),
      prisma.aIUsageLog.create({
        data: {
          userId,
          actionType: "TEXT_GENERATION",
          promptSnippet: prompt.substring(0, 150), // Store only a snippet for privacy/size
        },
      })
    ]);

    return { success: true, data: text };

  } catch (error: unknown) {
    // 4. Critical Error Logging (so it shows up in Admin Panel)
    const errorMessage = error instanceof Error ? error.message : "Unknown AI API Crash";
    
    await prisma.systemErrorLog.create({
      data: {
        errorType: "AI_API_CRASH",
        message: `Groq AI API Crash: ${errorMessage}`,
        stackTrace: error instanceof Error ? error.stack : undefined,
      }
    });

    return { 
      success: false, 
      error: "Our AI systems are currently experiencing an issue. The site administrators have been automatically notified.",
      isRateLimited: false
    };
  }
}
