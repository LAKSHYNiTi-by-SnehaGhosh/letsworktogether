import "server-only";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { rateLimitAction } from "./rate-limit";
import { logger } from "./logger";

export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

type ActionContext = {
  userId: string;
};

export function createSafeAction<Input, Output>(
  schema: z.Schema<Input>,
  handler: (parsedInput: Input, ctx: ActionContext) => Promise<Output>,
  options?: {
    actionName?: string;
    requireAuth?: boolean;
    auditLog?: boolean;
    rateLimit?: boolean;
  }
) {
  return async (input: Input) => {
    try {
      const actionName = options?.actionName || "UnnamedAction";
      const requireAuth = options?.requireAuth ?? true;
      const shouldRateLimit = options?.rateLimit ?? true;

      let userId = "anonymous";
      const ctx: ActionContext = { userId: "" };

      if (requireAuth) {
        const authCtx = await auth();
        if (!authCtx.userId) {
          throw new ActionError("Unauthorized");
        }
        userId = authCtx.userId;
        ctx.userId = authCtx.userId;
      }

      if (shouldRateLimit) {
        await rateLimitAction(userId, actionName);
      }

      // Input Validation
      const parsedInput = schema.safeParse(input);
      if (!parsedInput.success) {
        throw new ActionError(`Invalid input: ${parsedInput.error.issues.map(e => e.message).join(", ")}`);
      }

      // Execute Handler
      const result = await handler(parsedInput.data, ctx);

      // Audit Logging for successful state changes
      if (options?.auditLog && userId !== "anonymous") {
        await logger.audit({
          actorId: userId,
          action: actionName,
          resource: "ServerAction",
          resourceId: actionName,
        });
      }

      return { success: true, data: result };
    } catch (error) {
      if (error instanceof ActionError || (error as Error).message.includes("Rate limit")) {
        return { success: false, error: (error as Error).message };
      }
      
      // Generic error response to avoid leaking stack traces or sensitive DB details
      console.error("Internal Server Error in Action:", error);
      return { success: false, error: "An unexpected error occurred. Please try again later." };
    }
  };
}
