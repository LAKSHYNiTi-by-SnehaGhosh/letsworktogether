import { prisma } from "./prisma";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function checkAndIncrementAIQuota(userId: string, actionType: string = "AI_REQUEST") {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      subscriptionPlan: true,
      aiUsageCount: true,
      aiTotalLimit: true,
      aiUsageResetDate: true,
    },
  });

  if (!user) {
    return { allowed: false, error: "User not found for AI quota verification." };
  }

  const now = new Date();

  // Tiered defaults
  let effectiveTotalLimit = user.aiTotalLimit || 50;
  if (user.subscriptionPlan === "FREE" && (!user.aiTotalLimit || user.aiTotalLimit > 50)) {
    effectiveTotalLimit = 50; // Strict free limit (50 requests per cycle)
  } else if (user.subscriptionPlan === "PRO" && (!user.aiTotalLimit || user.aiTotalLimit < 500)) {
    effectiveTotalLimit = 500; // Pro limit
  } else if (user.subscriptionPlan === "ENTERPRISE" && (!user.aiTotalLimit || user.aiTotalLimit < 5000)) {
    effectiveTotalLimit = 5000; // Enterprise limit
  }

  // Monthly Reset Check
  if (!user.aiUsageResetDate || now > user.aiUsageResetDate) {
    const nextReset = new Date();
    nextReset.setDate(nextReset.getDate() + 30);

    await prisma.user.update({
      where: { id: userId },
      data: {
        aiUsageCount: 0,
        aiUsageResetDate: nextReset,
        aiTotalLimit: effectiveTotalLimit,
      },
    });

    user.aiUsageCount = 0;
  }

  // Enforce Rate Limit
  if (user.aiUsageCount >= effectiveTotalLimit) {
    const errorMsg = `AI usage limit reached (${user.aiUsageCount}/${effectiveTotalLimit} requests) on your ${user.subscriptionPlan} plan. Upgrade to Pro or Enterprise to continue using AI.`;

    await prisma.systemErrorLog.create({
      data: {
        errorType: "AI_LIMIT_REACHED",
        message: `User ${user.id} (${user.subscriptionPlan}) hit AI usage quota (${user.aiUsageCount}/${effectiveTotalLimit}).`,
      },
    });

    return {
      allowed: false,
      error: errorMsg,
      plan: user.subscriptionPlan,
      used: user.aiUsageCount,
      limit: effectiveTotalLimit,
    };
  }

  // Increment usage count and create log
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { aiUsageCount: { increment: 1 } },
    }),
    prisma.aIUsageLog.create({
      data: {
        userId,
        actionType,
        promptSnippet: actionType,
      },
    }),
  ]);

  return {
    allowed: true,
    plan: user.subscriptionPlan,
    used: user.aiUsageCount + 1,
    limit: effectiveTotalLimit,
  };
}

export async function generateTextWithUsageTracking(userId: string, prompt: string) {
  try {
    const quotaCheck = await checkAndIncrementAIQuota(userId, "TEXT_GENERATION");
    if (!quotaCheck.allowed) {
      return { success: false, error: quotaCheck.error, isRateLimited: true };
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });

    const text = chatCompletion.choices[0]?.message?.content || "";

    return { success: true, data: text };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown AI API Crash";

    await prisma.systemErrorLog.create({
      data: {
        errorType: "AI_API_CRASH",
        message: `Groq AI API Crash: ${errorMessage}`,
        stackTrace: error instanceof Error ? error.stack : undefined,
      },
    });

    return {
      success: false,
      error: "Our AI systems are currently experiencing an issue. Site administrators have been notified.",
      isRateLimited: false,
    };
  }
}
