"use server";

import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { z } from "zod";
import { createSafeAction } from "@/lib/safe-action";
import { sanitizeInput } from "@/lib/sanitize";

const updateTaskStatusSchema = z.object({
  taskId: z.string().uuid(),
  newStatus: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
});

export const updateTaskStatus = createSafeAction(
  updateTaskStatusSchema,
  async (data, ctx) => {
    await prisma.task.update({
      where: { id: data.taskId },
      data: { status: data.newStatus },
    });
    return { success: true };
  },
  {
    actionName: "updateTaskStatus",
    auditLog: true,
  }
);

const createTaskSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1).max(255),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  assigneeId: z.string().optional(),
  milestoneId: z.string().uuid().optional(),
});

export const createTask = createSafeAction(
  createTaskSchema,
  async (data, ctx) => {
    const taskId = randomUUID();
    
    // Sanitize user input to prevent XSS
    const cleanTitle = sanitizeInput(data.title);

    await prisma.task.create({
      data: {
        id: taskId,
        projectId: data.projectId,
        title: cleanTitle,
        status: data.status,
        priority: "MEDIUM",
        assigneeId: data.assigneeId || ctx.userId,
        milestoneId: data.milestoneId,
      },
    });

    return { success: true, taskId };
  },
  {
    actionName: "createTask",
    auditLog: true,
  }
);

const assignTaskSchema = z.object({
  taskId: z.string().uuid(),
  assigneeId: z.string().nullable(),
});

export const assignTask = createSafeAction(
  assignTaskSchema,
  async (data, ctx) => {
    await prisma.task.update({
      where: { id: data.taskId },
      data: { assigneeId: data.assigneeId },
    });
    return { success: true };
  },
  { actionName: "assignTask", auditLog: true }
);

const submitTaskSchema = z.object({
  taskId: z.string().uuid(),
  content: z.string().min(1),
});

export const submitTask = createSafeAction(
  submitTaskSchema,
  async (data, ctx) => {
    const submissionId = randomUUID();
    const cleanContent = sanitizeInput(data.content);

    await prisma.$transaction(async (tx) => {
      await tx.taskSubmission.create({
        data: {
          id: submissionId,
          taskId: data.taskId,
          submitterId: ctx.userId,
          content: cleanContent,
          status: "PENDING",
        }
      });
      
      await tx.task.update({
        where: { id: data.taskId },
        data: { status: "IN_REVIEW" }
      });
    });
    return { success: true, submissionId };
  },
  { actionName: "submitTask", auditLog: true }
);

const reviewTaskSchema = z.object({
  submissionId: z.string().uuid(),
  status: z.enum(["APPROVED", "REJECTED"]),
});

export const reviewTask = createSafeAction(
  reviewTaskSchema,
  async (data, ctx) => {
    const submission = await prisma.taskSubmission.findUnique({
      where: { id: data.submissionId }
    });

    if (!submission) throw new Error("Submission not found");

    await prisma.$transaction(async (tx) => {
      await tx.taskSubmission.update({
        where: { id: data.submissionId },
        data: { status: data.status }
      });

      if (data.status === "APPROVED") {
        await tx.task.update({
          where: { id: submission.taskId },
          data: { status: "DONE" }
        });
      } else {
        await tx.task.update({
          where: { id: submission.taskId },
          data: { status: "IN_PROGRESS" }
        });
      }
    });

    return { success: true };
  },
  { actionName: "reviewTask", auditLog: true }
);
