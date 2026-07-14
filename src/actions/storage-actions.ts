"use server";

import { z } from "zod";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "@/lib/storage/r2";
import { STORAGE_CONFIG, buildStoragePath } from "@/lib/storage/config";
import { createSafeAction, ActionError } from "@/lib/safe-action";
import { randomUUID } from "crypto";

const getUploadUrlSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  entityType: z.enum(["TASK", "COMMENT", "PROJECT", "USER_AVATAR"]),
  entityId: z.string(),
  isPublic: z.boolean().default(false),
});

export const getUploadUrl = createSafeAction(
  getUploadUrlSchema,
  async (input, ctx) => {
    // 1. File Validation
    if (input.fileSize > STORAGE_CONFIG.MAX_FILE_SIZE) {
      throw new ActionError(`File size exceeds maximum allowed size of ${STORAGE_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    if (input.fileType.startsWith("image/") && input.fileSize > STORAGE_CONFIG.MAX_IMAGE_SIZE) {
      throw new ActionError(`Image size exceeds maximum allowed size of ${STORAGE_CONFIG.MAX_IMAGE_SIZE / 1024 / 1024}MB`);
    }

    const isImage = STORAGE_CONFIG.ALLOWED_IMAGE_TYPES.includes(input.fileType);
    const isDoc = STORAGE_CONFIG.ALLOWED_DOC_TYPES.includes(input.fileType);

    if (!isImage && !isDoc) {
      throw new ActionError("File type is not supported");
    }

    // 2. Permission Validation (Basic example: user must be authenticated, which is handled by createSafeAction)
    // In a production app, verify if the user has access to `entityId` of `entityType` here.

    // 3. Setup File Path
    const fileId = randomUUID();
    const filePath = buildStoragePath(input.entityType, input.entityId, fileId, input.fileName);
    const bucket = input.isPublic ? STORAGE_CONFIG.BUCKET_PUBLIC : STORAGE_CONFIG.BUCKET_PRIVATE;

    // 4. Generate Presigned URL
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: filePath,
      ContentType: input.fileType,
      ContentLength: input.fileSize,
      Metadata: {
        uploaderId: ctx.userId,
      }
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 }); // 1 hour

    return {
      uploadUrl,
      filePath,
      bucket,
      fileId,
    };
  },
  { actionName: "GenerateUploadUrl", requireAuth: true, rateLimit: true }
);

const getDownloadUrlSchema = z.object({
  filePath: z.string(),
  isPublic: z.boolean().default(false),
});

export const getDownloadUrl = createSafeAction(
  getDownloadUrlSchema,
  async (input, ctx) => {
    const bucket = input.isPublic ? STORAGE_CONFIG.BUCKET_PUBLIC : STORAGE_CONFIG.BUCKET_PRIVATE;

    // Verify user has permission to read this file
    
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: input.filePath,
    });

    const downloadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });

    return { downloadUrl };
  },
  { actionName: "GenerateDownloadUrl", requireAuth: true, rateLimit: true }
);

const deleteFileSchema = z.object({
  filePath: z.string(),
  isPublic: z.boolean().default(false),
});

export const deleteFile = createSafeAction(
  deleteFileSchema,
  async (input, ctx) => {
    // Verify user has permission to delete this file

    const bucket = input.isPublic ? STORAGE_CONFIG.BUCKET_PUBLIC : STORAGE_CONFIG.BUCKET_PRIVATE;

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: input.filePath,
    });

    await r2Client.send(command);

    return { success: true };
  },
  { actionName: "DeleteStorageFile", requireAuth: true, auditLog: true }
);
