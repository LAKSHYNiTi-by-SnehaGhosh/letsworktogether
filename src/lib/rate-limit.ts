import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logger } from "./logger";

// A fallback in-memory cache if Redis is not configured (useful for development)
const cache = new Map();

// Allow fallback if no Redis URL is provided, but warn the user.
let redis: Redis | undefined;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = Redis.fromEnv();
  } else {
    console.warn("Upstash Redis is not configured. Falling back to in-memory rate limiting for development.");
  }
} catch (error) {
  console.warn("Failed to initialize Upstash Redis:", error);
}

// Default rate limiter: 10 requests per 10 seconds per user/IP
const standardLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
}) : {
  limit: async (identifier: string) => {
    // Basic in-memory mock for dev
    const now = Date.now();
    const windowStart = now - 10000;
    let requests = cache.get(identifier) || [];
    requests = requests.filter((time: number) => time > windowStart);
    requests.push(now);
    cache.set(identifier, requests);
    return {
      success: requests.length <= 10,
      limit: 10,
      remaining: Math.max(0, 10 - requests.length),
      reset: now + 10000,
    };
  }
};

export async function rateLimitAction(identifier: string, actionName: string) {
  const { success, limit, reset, remaining } = await standardLimiter.limit(`rate_limit:${actionName}:${identifier}`);

  if (!success) {
    console.warn(`Rate limit exceeded for action ${actionName} by ${identifier}`);
    
    // Log suspicious activity
    await logger.audit({
      actorId: identifier,
      action: "RATE_LIMIT_EXCEEDED",
      resource: "ServerAction",
      resourceId: actionName,
    });

    throw new Error("Rate limit exceeded. Please try again later.");
  }

  return { limit, reset, remaining };
}
