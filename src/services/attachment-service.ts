import { prisma } from "@/lib/prisma";

export type CreateAttachmentInput = {
  uploaderId: string;
  entityType: string;
  entityId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
};

export class AttachmentService {
  static async createAttachment(data: CreateAttachmentInput) {
    return await prisma.attachment.create({
      data,
    });
  }

  static async getAttachmentsByEntity(entityType: string, entityId: string) {
    return await prisma.attachment.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              }
            }
          }
        }
      }
    });
  }

  static async deleteAttachment(id: string, userId: string) {
    const attachment = await prisma.attachment.findUnique({
      where: { id },
    });

    if (!attachment) {
      throw new Error("Attachment not found");
    }

    // In a real app, admins might also be able to delete
    if (attachment.uploaderId !== userId) {
      throw new Error("Unauthorized to delete this attachment");
    }

    return await prisma.attachment.delete({
      where: { id },
    });
  }
}
