import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const DAILY_LIMIT = 5;

// Mock DB
let mockUser = {
  id: "test_user",
  aiUsageCount: 0,
  aiUsageResetDate: new Date()
};

async function runTest() {
  console.log("=== STARTING AI QUOTA & GROQ TEST ===\n");

  // Test Function (simulating what ai.ts does)
  async function simulateGenerateSprint() {
    console.log("\n-> Simulating generateSprintForProject...");
    
    const now = new Date();
    let currentUsage = mockUser.aiUsageCount;
    let resetDate = mockUser.aiUsageResetDate;

    if (!resetDate || resetDate.toDateString() !== now.toDateString()) {
      currentUsage = 0;
      resetDate = now;
    }

    if (currentUsage >= DAILY_LIMIT) {
      console.log("[!] BLOCKED: Daily limit reached!");
      return false;
    }

    console.log(`[+] ALLOWED: Usage count is ${currentUsage}/${DAILY_LIMIT}. Calling Groq API...`);
    
    // Call Groq
    const systemPrompt = `You are an expert AI Project Manager. The user is creating a sprint. Project Name: Test. Request: Create 1 milestone with 1 task.
Output JSON only:
{
  "milestones": [
    {
      "title": "Title",
      "description": "Desc",
      "tasks": [{"title": "Task", "description": "Desc", "priority": "HIGH"}]
    }
  ]
}`;
    
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: systemPrompt }],
      temperature: 1,
      max_completion_tokens: 1024,
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(response.choices[0]?.message?.content || "{}");
    console.log("[+] Received valid JSON response from Groq:");
    console.log(JSON.stringify(data, null, 2));

    // Increment usage
    mockUser.aiUsageCount = currentUsage + 1;
    mockUser.aiUsageResetDate = resetDate;

    console.log(`[+] DB Updated: Usage count is now ${currentUsage + 1}`);
    return true;
  }

  // 3. Test loop - we will hit it 6 times to see if the 6th is blocked
  for (let i = 1; i <= 6; i++) {
    console.log(`\n--- Test Request #${i} ---`);
    await simulateGenerateSprint();
  }

  console.log("\n=== TEST COMPLETED SUCCESSFULLY ===");
}

runTest().catch(console.error);
