import "server-only";
import { prisma } from "@/lib/prisma";

type ActorType = "USER" | "SYSTEM" | "API_KEY";

interface AuditLogParams {
  actorId: string;
  actorType?: ActorType;
  action: string;
  resource: string;
  resourceId: string;
  oldValues?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  newValues?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  ipAddress?: string | null;
  userAgent?: string | null;
}

interface ActivityLogParams {
  userId: string;
  organizationId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const logger = {
  /**
   * Log critical security or state-changing events (e.g. creating tasks, updating roles).
   */
  async audit(params: AuditLogParams) {
    try {
      await prisma.auditLog.create({
        data: {
          actorId: params.actorId,
          actorType: params.actorType || "USER",
          action: params.action,
          resource: params.resource,
          resourceId: params.resourceId,
          oldValues: params.oldValues ?? undefined,
          newValues: params.newValues ?? undefined,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    } catch (error) {
      console.error("Failed to write audit log", error);
    }
  },

  /**
   * Log user activity for general tracking (e.g. viewed page, commented).
   */
  async activity(params: ActivityLogParams) {
    try {
      await prisma.activityLog.create({
        data: {
          userId: params.userId,
          organizationId: params.organizationId,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId,
          metadata: params.metadata ?? undefined,
        },
      });
    } catch (error) {
      console.error("Failed to write activity log", error);
    }
  },
};
