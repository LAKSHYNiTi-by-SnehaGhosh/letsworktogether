"use server";

import { randomUUID } from "crypto";
import { currentUser } from "@clerk/nextjs/server";
import { requireUser } from "@/lib/auth-sync";
import { prisma } from "@/lib/prisma";
import { sendTeamInvitationEmail } from "@/lib/email";

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return "https://letsworktogether.lakshyniti.com";
}

export async function createOrganizationInvitation(data: {
  email: string;
  roleName?: string;
}) {
  const userId = await requireUser();
  const clerkUser = await currentUser();
  if (!userId || !clerkUser) {
    throw new Error("Unauthorized");
  }

  const email = data.email.trim().toLowerCase();
  const roleName = (data.roleName || "Member").toUpperCase();

  if (!email || !email.includes("@")) {
    return { success: false, error: "Please provide a valid email address." };
  }

  try {
    // 1. Get user's active organization or create a default one if none exists
    let userOrgMember = await prisma.organizationMember.findFirst({
      where: { userId },
      include: {
        organization: true,
        role: true,
      },
    });

    let organizationId: string;
    let organizationName: string;

    if (!userOrgMember) {
      let adminRole = await prisma.role.findFirst({ where: { name: "Admin" } });
      if (!adminRole) {
        adminRole = await prisma.role.create({
          data: { name: "Admin", description: "Organization Administrator" },
        });
      }

      const defaultOrg = await prisma.organization.create({
        data: {
          name: `${clerkUser.firstName || "User"}'s Workspace`,
          slug: `org-${userId.slice(0, 8)}`,
          members: {
            create: {
              userId,
              roleId: adminRole.id,
            },
          },
        },
      });

      organizationId = defaultOrg.id;
      organizationName = defaultOrg.name;
    } else {
      organizationId = userOrgMember.organizationId;
      organizationName = userOrgMember.organization.name;
    }

    // 2. Check if user is already a member of this organization
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const existingMember = await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId: existingUser.id,
          },
        },
      });
      if (existingMember) {
        return { success: false, error: "This user is already a member of your organization." };
      }
    }

    // 3. Find or create matching Role
    let role = await prisma.role.findFirst({
      where: {
        name: { equals: roleName, mode: "insensitive" },
      },
    });

    if (!role) {
      role = await prisma.role.findFirst({ where: { name: "Admin" } });
    }

    // 4. Check for existing pending invitation
    const existingInvite = await prisma.organizationInvitation.findFirst({
      where: {
        organizationId,
        email,
        status: "PENDING",
      },
    });

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    let invitation;

    if (existingInvite) {
      invitation = await prisma.organizationInvitation.update({
        where: { id: existingInvite.id },
        data: {
          token,
          roleId: role?.id || null,
          roleName,
          expiresAt,
          invitedById: userId,
          updatedAt: new Date(),
        },
      });
    } else {
      invitation = await prisma.organizationInvitation.create({
        data: {
          organizationId,
          email,
          roleId: role?.id || null,
          roleName,
          token,
          invitedById: userId,
          status: "PENDING",
          expiresAt,
        },
      });
    }

    // 5. Generate Invite URL & Send Email
    const baseUrl = getBaseUrl();
    const inviteLink = `${baseUrl}/invite/${token}`;

    const inviterName = clerkUser.firstName
      ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
      : clerkUser.emailAddresses[0]?.emailAddress || "An Administrator";

    await sendTeamInvitationEmail({
      to: email,
      organizationName,
      inviterName,
      roleName,
      inviteLink,
    });

    // 6. Log audit event
    await prisma.auditLog.create({
      data: {
        actorId: userId,
        actorType: "USER",
        action: "CREATE_INVITATION",
        resource: "OrganizationInvitation",
        resourceId: invitation.id,
        newValues: { email, roleName, organizationId, expiresAt: expiresAt.toISOString() },
      },
    });

    return {
      success: true,
      invitationId: invitation.id,
      token,
      inviteLink,
      message: `Invitation sent to ${email} successfully!`,
    };
  } catch (error: any) {
    console.error("Error creating organization invitation:", error);
    return { success: false, error: error.message || "Failed to send invitation." };
  }
}

export async function getInvitationDetails(token: string) {
  if (!token) {
    return { success: false, error: "INVALID_TOKEN", message: "No invitation token provided." };
  }

  try {
    // 1. Try OrganizationInvitation first
    const orgInvitation = await prisma.organizationInvitation.findUnique({
      where: { token },
      include: {
        organization: true,
        invitedBy: {
          include: { profile: true },
        },
      },
    });

    if (orgInvitation) {
      const now = new Date();
      if (orgInvitation.status === "PENDING" && orgInvitation.expiresAt < now) {
        await prisma.organizationInvitation.update({
          where: { id: orgInvitation.id },
          data: { status: "EXPIRED" },
        });
        orgInvitation.status = "EXPIRED";
      }

      if (orgInvitation.status === "EXPIRED") {
        return {
          success: false,
          error: "INVITATION_EXPIRED",
          message: "This invitation link has expired. Please ask the inviter to resend your invite.",
          invitation: orgInvitation,
        };
      }

      if (orgInvitation.status === "REVOKED") {
        return {
          success: false,
          error: "INVITATION_REVOKED",
          message: "This invitation has been revoked by the organization administrator.",
          invitation: orgInvitation,
        };
      }

      if (orgInvitation.status === "ACCEPTED") {
        return {
          success: false,
          error: "INVITATION_ACCEPTED",
          message: "This invitation has already been accepted.",
          invitation: orgInvitation,
        };
      }

      const inviterProfile = orgInvitation.invitedBy?.profile;
      const inviterName = inviterProfile
        ? `${inviterProfile.firstName} ${inviterProfile.lastName}`.trim()
        : "An Administrator";

      return {
        success: true,
        isProject: false,
        invitation: {
          id: orgInvitation.id,
          token: orgInvitation.token,
          email: orgInvitation.email,
          roleName: orgInvitation.roleName,
          status: orgInvitation.status,
          expiresAt: orgInvitation.expiresAt,
          organizationName: orgInvitation.organization.name,
          organizationSlug: orgInvitation.organization.slug,
          inviterName,
        },
      };
    }

    // 2. Fallback to ProjectInvitation
    const projectInvitation = await prisma.projectInvitation.findUnique({
      where: { token },
      include: {
        project: true,
      },
    });

    if (projectInvitation) {
      if (projectInvitation.status === "ACCEPTED") {
        return {
          success: false,
          error: "INVITATION_ACCEPTED",
          message: "This project invitation has already been accepted.",
          invitation: projectInvitation,
        };
      }

      if (projectInvitation.status === "REJECTED") {
        return {
          success: false,
          error: "INVITATION_REVOKED",
          message: "This project invitation has been cancelled or rejected.",
          invitation: projectInvitation,
        };
      }

      return {
        success: true,
        isProject: true,
        invitation: {
          id: projectInvitation.id,
          token: projectInvitation.token,
          email: projectInvitation.email,
          roleName: projectInvitation.role,
          status: projectInvitation.status,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
          organizationName: projectInvitation.project.name,
          organizationSlug: projectInvitation.project.id,
          inviterName: "Project Administrator",
          projectId: projectInvitation.projectId,
        },
      };
    }

    return { success: false, error: "INVITATION_NOT_FOUND", message: "Invitation not found or link is invalid." };
  } catch (error: any) {
    console.error("Error retrieving invitation details:", error);
    return { success: false, error: "SERVER_ERROR", message: "Failed to load invitation details." };
  }
}

export async function acceptOrganizationInvitation(token: string) {
  const userId = await requireUser();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    let invitation = await prisma.organizationInvitation.findUnique({
      where: { token },
      include: { organization: true },
    });

    if (!invitation) {
      // Import acceptProjectInvitation dynamically or call it
      const { acceptProjectInvitation } = await import("@/app/actions/projects");
      const projRes = await acceptProjectInvitation(token);
      if (projRes.success) {
        return {
          success: true,
          projectId: projRes.projectId,
          message: "You have successfully joined the project!",
        };
      }
      return projRes;
    }

    if (invitation.status === "ACCEPTED") {
      return { success: true, message: "Invitation already accepted.", organizationId: invitation.organizationId };
    }

    if (invitation.status === "REVOKED") {
      return { success: false, error: "This invitation has been revoked." };
    }

    if (invitation.expiresAt < new Date() || invitation.status === "EXPIRED") {
      await prisma.organizationInvitation.update({
        where: { id: invitation.id },
        data: { status: "EXPIRED" },
      });
      return { success: false, error: "This invitation has expired." };
    }

    // Resolve or fallback role for organization member
    let roleId = invitation.roleId;
    if (!roleId) {
      let role = await prisma.role.findFirst({
        where: { name: { equals: invitation.roleName, mode: "insensitive" } },
      });
      if (!role) {
        role = await prisma.role.findFirst({ where: { name: "Admin" } }) ||
               await prisma.role.create({ data: { name: "Admin", description: "Default Admin Role" } });
      }
      roleId = role.id;
    }

    // Execute atomic transaction
    await prisma.$transaction(async (tx) => {
      // 1. Mark invitation as accepted
      await tx.organizationInvitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED", updatedAt: new Date() },
      });

      // 2. Add or update OrganizationMember
      await tx.organizationMember.upsert({
        where: {
          organizationId_userId: {
            organizationId: invitation.organizationId,
            userId,
          },
        },
        update: {
          roleId,
          deletedAt: null,
        },
        create: {
          organizationId: invitation.organizationId,
          userId,
          roleId,
        },
      });

      // 3. Log audit action
      await tx.auditLog.create({
        data: {
          actorId: userId,
          actorType: "USER",
          action: "ACCEPT_INVITATION",
          resource: "OrganizationMember",
          resourceId: invitation.organizationId,
          newValues: { invitationId: invitation.id, roleId },
        },
      });
    });

    return {
      success: true,
      organizationId: invitation.organizationId,
      organizationName: invitation.organization.name,
      message: `You have successfully joined ${invitation.organization.name}!`,
    };
  } catch (error: any) {
    console.error("Error accepting organization invitation:", error);
    return { success: false, error: error.message || "Failed to accept invitation." };
  }
}

export async function declineOrganizationInvitation(token: string) {
  try {
    const invitation = await prisma.organizationInvitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return { success: false, error: "Invitation not found." };
    }

    await prisma.organizationInvitation.update({
      where: { id: invitation.id },
      data: { status: "REVOKED", updatedAt: new Date() },
    });

    return { success: true, message: "Invitation declined." };
  } catch (error: any) {
    console.error("Error declining invitation:", error);
    return { success: false, error: "Failed to decline invitation." };
  }
}

export async function revokeOrganizationInvitation(invitationId: string) {
  const userId = await requireUser();
  if (!userId) throw new Error("Unauthorized");

  try {
    const invitation = await prisma.organizationInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      return { success: false, error: "Invitation not found." };
    }

    // Verify inviter or admin status
    const userMember = await prisma.organizationMember.findFirst({
      where: { organizationId: invitation.organizationId, userId },
    });

    if (!userMember) {
      return { success: false, error: "Unauthorized to revoke invitations for this organization." };
    }

    await prisma.organizationInvitation.update({
      where: { id: invitationId },
      data: { status: "REVOKED", updatedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        actorId: userId,
        actorType: "USER",
        action: "REVOKE_INVITATION",
        resource: "OrganizationInvitation",
        resourceId: invitationId,
      },
    });

    return { success: true, message: "Invitation revoked successfully." };
  } catch (error: any) {
    console.error("Error revoking invitation:", error);
    return { success: false, error: "Failed to revoke invitation." };
  }
}

export async function resendOrganizationInvitation(invitationId: string) {
  const userId = await requireUser();
  const clerkUser = await currentUser();
  if (!userId || !clerkUser) throw new Error("Unauthorized");

  try {
    const invitation = await prisma.organizationInvitation.findUnique({
      where: { id: invitationId },
      include: { organization: true },
    });

    if (!invitation) {
      return { success: false, error: "Invitation not found." };
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const updatedInvite = await prisma.organizationInvitation.update({
      where: { id: invitationId },
      data: {
        token,
        status: "PENDING",
        expiresAt,
        updatedAt: new Date(),
      },
    });

    const baseUrl = getBaseUrl();
    const inviteLink = `${baseUrl}/invite/${token}`;

    const inviterName = clerkUser.firstName
      ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
      : clerkUser.emailAddresses[0]?.emailAddress || "An Administrator";

    await sendTeamInvitationEmail({
      to: invitation.email,
      organizationName: invitation.organization.name,
      inviterName,
      roleName: invitation.roleName,
      inviteLink,
    });

    return {
      success: true,
      token,
      inviteLink,
      message: `Invitation resent to ${invitation.email}!`,
    };
  } catch (error: any) {
    console.error("Error resending invitation:", error);
    return { success: false, error: "Failed to resend invitation." };
  }
}

export async function getOrganizationInvitations() {
  const userId = await requireUser();
  if (!userId) return [];

  try {
    const userMember = await prisma.organizationMember.findFirst({
      where: { userId },
    });

    if (!userMember) return [];

    const now = new Date();

    // Auto-update expired invitations
    await prisma.organizationInvitation.updateMany({
      where: {
        organizationId: userMember.organizationId,
        status: "PENDING",
        expiresAt: { lt: now },
      },
      data: { status: "EXPIRED" },
    });

    const invitations = await prisma.organizationInvitation.findMany({
      where: {
        organizationId: userMember.organizationId,
      },
      orderBy: { createdAt: "desc" },
      include: {
        invitedBy: {
          include: { profile: true },
        },
      },
    });

    return invitations.map((inv) => ({
      id: inv.id,
      email: inv.email,
      roleName: inv.roleName,
      token: inv.token,
      status: inv.status,
      expiresAt: inv.expiresAt,
      createdAt: inv.createdAt,
      invitedByName: inv.invitedBy.profile
        ? `${inv.invitedBy.profile.firstName} ${inv.invitedBy.profile.lastName}`.trim()
        : inv.invitedBy.email,
    }));
  } catch (error) {
    console.error("Error fetching organization invitations:", error);
    return [];
  }
}
