import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    // Dynamic import to avoid evaluating pg/adapter at build time
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require('pg');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaPg } = require('@prisma/adapter-pg');
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }

  // Build-time / no DB fallback: return a client that will fail gracefully at runtime
  throw new Error(
    'DATABASE_URL is not set. Database operations are not available.'
  );
}

// Lazy getter — PrismaClient is only instantiated when first accessed at runtime,
// NOT during Next.js build-time module evaluation.
let _prisma: PrismaClient | undefined;

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!_prisma) {
      _prisma = globalForPrisma.prisma ?? createPrismaClient();
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = _prisma;
      }
    }
    return (_prisma as Record<string | symbol, unknown>)[prop];
  },
});
