"use server";

import { currentUser } from "@clerk/nextjs/server";
import { requireUser } from "@/lib/auth-sync";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { sendProjectInvitationEmail } from "@/lib/email";

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return "https://letsworktogether.lakshyniti.com";
}

export async function createProject(data: {
  name: string;
  description: string;
}) {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    throw new Error("Unauthorized");
  }
  const userId = clerkUser.id;
  const email = clerkUser.emailAddresses[0]?.emailAddress || "";

  try {
    const projectId = randomUUID();
    
    // Ensure the user exists in database
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: email,
      }
    });

    let userOrg = await prisma.organizationMember.findFirst({
      where: { userId }
    });

    if (!userOrg) {
      const adminRole = await prisma.role.findFirst({ where: { name: "Admin" } }) || 
                        await prisma.role.create({ data: { name: "Admin" } });

      const defaultOrg = await prisma.organization.create({
        data: {
          name: `${clerkUser.firstName || "User"}'s Workspace`,
          slug: `org-${userId.slice(0, 8)}`,
          members: {
            create: {
              userId,
              roleId: adminRole.id,
            }
          }
        }
      });
      userOrg = { organizationId: defaultOrg.id, userId, roleId: adminRole.id, id: "new", joinedAt: new Date(), createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
    }

    await prisma.$transaction(async (tx) => {
      await tx.project.create({
        data: {
          id: projectId,
          name: data.name,
          description: data.description,
          organizationId: userOrg.organizationId,
          status: "ACTIVE",
          members: {
            create: {
              userId,
              role: "OWNER"
            }
          }
        },
      });
    });

    return { success: true, projectId };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project." };
  }
}

export async function joinProject(projectId: string) {
  const userId = await requireUser();
  if (!userId) throw new Error("Unauthorized");

  try {
    await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role: "MEMBER"
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Error joining project:", error);
    return { success: false, error: "Failed to join project. You may already be a member, or the project doesn't exist." };
  }
}

export async function inviteMemberToProject(
  projectId: string,
  identifier: string,
  role = "MEMBER",
  message?: string
) {
  const userId = await requireUser();
  const clerkUser = await currentUser();
  if (!userId || !clerkUser) return { success: false, error: "Unauthorized" };

  const email = identifier.trim().toLowerCase();
  const roleName = (role || "MEMBER").toUpperCase();

  if (!email || !email.includes("@")) {
    return { success: false, error: "Please provide a valid email address." };
  }

  // Fetch project and verify ownership or admin permission
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: { where: { userId } },
      organization: { include: { members: { where: { userId } } } }
    }
  });

  if (!project) {
    return { success: false, error: "Project not found." };
  }

  const member = project.members[0];
  const isOrgAdmin = project.organization?.members[0]?.roleId;

  if (!member && !isOrgAdmin) {
    return { success: false, error: "You do not have permission to invite members to this project." };
  }

  if (member && member.role !== "OWNER" && member.role !== "ADMIN" && !isOrgAdmin) {
    return { success: false, error: "Only project Owners and Admins can invite new members." };
  }

  // Check if target user is already a member
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const existingMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: existingUser.id } }
    });
    if (existingMember) {
      return { success: false, error: "This user is already a member of this project." };
    }
  }

  try {
    const token = randomUUID();

    const existingInvite = await prisma.projectInvitation.findUnique({
      where: {
        projectId_email: { projectId, email }
      }
    });

    let invite;
    if (existingInvite) {
      invite = await prisma.projectInvitation.update({
        where: { id: existingInvite.id },
        data: { status: "PENDING", token, role: roleName }
      });
    } else {
      invite = await prisma.projectInvitation.create({
        data: {
          projectId,
          email,
          token,
          role: roleName
        }
      });
    }

    const baseUrl = getBaseUrl();
    const inviteLink = `${baseUrl}/invite/${token}`;

    const inviterName = clerkUser.firstName
      ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
      : clerkUser.emailAddresses[0]?.emailAddress || "Project Admin";

    const emailResult = await sendProjectInvitationEmail({
      to: email,
      projectName: project.name,
      inviterName,
      roleName,
      inviteLink,
      message
    });

    if (!emailResult.success) {
      return {
        success: false,
        error: emailResult.error || "Email delivery failed.",
        token,
        inviteLink,
        invitationId: invite.id
      };
    }

    return {
      success: true,
      token,
      inviteLink,
      invitationId: invite.id,
      message: `Invitation email sent successfully to ${email}!`
    };
  } catch (error: any) {
    console.error("Error inviting member to project:", error);
    return { success: false, error: error.message || "Failed to send project invitation." };
  }
}

export async function updateProjectMemberRole(projectId: string, targetUserId: string, newRole: string) {
  const userId = await requireUser();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    const callerMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } }
    });

    if (!callerMember || (callerMember.role !== "OWNER" && callerMember.role !== "ADMIN")) {
      return { success: false, error: "Unauthorized to update member roles." };
    }

    if (callerMember.role === "ADMIN" && newRole === "OWNER") {
      return { success: false, error: "Only project Owners can transfer ownership." };
    }

    await prisma.projectMember.update({
      where: { projectId_userId: { projectId, userId: targetUserId } },
      data: { role: newRole }
    });

    return { success: true, message: "Member role updated successfully." };
  } catch (error: any) {
    console.error("Error updating member role:", error);
    return { success: false, error: "Failed to update member role." };
  }
}

export async function removeProjectMember(projectId: string, targetUserId: string) {
  const userId = await requireUser();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    const callerMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } }
    });

    if (!callerMember || (callerMember.role !== "OWNER" && callerMember.role !== "ADMIN")) {
      return { success: false, error: "Unauthorized to remove members." };
    }

    const targetMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: targetUserId } }
    });

    if (targetMember?.role === "OWNER") {
      return { success: false, error: "Cannot remove project owner." };
    }

    await prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId: targetUserId } }
    });

    return { success: true, message: "Member removed from project." };
  } catch (error: any) {
    console.error("Error removing project member:", error);
    return { success: false, error: "Failed to remove member." };
  }
}

export async function cancelProjectInvitation(invitationId: string) {
  const userId = await requireUser();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    const invite = await prisma.projectInvitation.findUnique({
      where: { id: invitationId }
    });

    if (!invite) return { success: false, error: "Invitation not found." };

    const callerMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: invite.projectId, userId } }
    });

    if (!callerMember || (callerMember.role !== "OWNER" && callerMember.role !== "ADMIN")) {
      return { success: false, error: "Unauthorized to cancel invitations." };
    }

    await prisma.projectInvitation.delete({
      where: { id: invitationId }
    });

    return { success: true, message: "Invitation cancelled." };
  } catch (error: any) {
    console.error("Error cancelling invitation:", error);
    return { success: false, error: "Failed to cancel invitation." };
  }
}

export async function resendProjectInvitation(invitationId: string) {
  const userId = await requireUser();
  const clerkUser = await currentUser();
  if (!userId || !clerkUser) return { success: false, error: "Unauthorized" };

  try {
    const invite = await prisma.projectInvitation.findUnique({
      where: { id: invitationId },
      include: { project: true }
    });

    if (!invite) return { success: false, error: "Invitation not found." };

    const token = randomUUID();
    await prisma.projectInvitation.update({
      where: { id: invitationId },
      data: { token, status: "PENDING" }
    });

    const baseUrl = getBaseUrl();
    const inviteLink = `${baseUrl}/invite/${token}`;

    const inviterName = clerkUser.firstName
      ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
      : clerkUser.emailAddresses[0]?.emailAddress || "Project Admin";

    const emailResult = await sendProjectInvitationEmail({
      to: invite.email,
      projectName: invite.project.name,
      inviterName,
      roleName: invite.role,
      inviteLink
    });

    if (!emailResult.success) {
      return { success: false, error: emailResult.error || "Email delivery failed.", inviteLink };
    }

    return { success: true, inviteLink, message: `Invitation email resent to ${invite.email}!` };
  } catch (error: any) {
    console.error("Error resending invitation:", error);
    return { success: false, error: "Failed to resend invitation." };
  }
}

export async function getInvitationDetails(token: string) {
  const invite = await prisma.projectInvitation.findUnique({
    where: { token },
    include: { project: true }
  });
  return invite;
}

export async function acceptProjectInvitation(token: string) {
  const userId = await requireUser();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const invite = await prisma.projectInvitation.findUnique({
    where: { token }
  });

  if (!invite || invite.status !== "PENDING") {
    return { success: false, error: "Invalid or expired invitation." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.projectInvitation.update({
        where: { id: invite.id },
        data: { status: "ACCEPTED" }
      });

      await tx.projectMember.create({
        data: {
          projectId: invite.projectId,
          userId,
          role: invite.role
        }
      });
    });

    return { success: true, projectId: invite.projectId };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "You are already a member of this project." };
    }
    console.error("Error accepting invite:", error);
    return { success: false, error: "Failed to accept invitation." };
  }
}

export async function rejectProjectInvitation(token: string) {
  const userId = await requireUser();
  if (!userId) throw new Error("Unauthorized");

  try {
    await prisma.projectInvitation.update({
      where: { token },
      data: { status: "REJECTED" }
    });
    return { success: true };
  } catch (error) {
    console.error("Error rejecting invite:", error);
    return { success: false, error: "Failed to reject invitation." };
  }
}

export async function updateProjectStatus(projectId: string, status: string) {
  const userId = await requireUser();
  if (!userId) throw new Error("Unauthorized");
  
  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: { projectId, userId }
    }
  });

  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
    throw new Error("Unauthorized to change project status");
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { status }
  });

  return { success: true };
}
