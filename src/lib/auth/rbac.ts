import { prisma } from '@/lib/prisma';
import { auth, clerkClient } from '@clerk/nextjs/server';

export interface RBACContext {
  userId: string;
  orgId: string;
}

/**
 * Fetch a user's roles and permissions for a specific organization from the database.
 */
export async function getEffectivePermissions(userId: string, orgId: string) {
  const member = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId: userId,
      }
    },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      }
    }
  });

  if (!member) {
    return { role: null, permissions: [] as string[] };
  }

  const role = member.role.name;
  const permissions = member.role.permissions.map(rp => rp.permission.name);

  return { role, permissions };
}

/**
 * Server-side guard to require a specific role in an organization.
 * Throws an Error if unauthorized.
 */
export async function requireRole(roleName: string, orgId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const { role } = await getEffectivePermissions(userId, orgId);
  
  if (role !== roleName && role !== 'Owner' && role !== 'Admin') {
    throw new Error(`Forbidden: Requires ${roleName} role`);
  }
}

/**
 * Server-side guard to require a specific permission in an organization.
 * Throws an Error if unauthorized.
 */
export async function requirePermission(permissionName: string, orgId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const { permissions, role } = await getEffectivePermissions(userId, orgId);
  
  // Owners and Admins generally bypass permission checks or have all permissions seeded.
  if (role === 'Owner') return;

  if (!permissions.includes(permissionName)) {
    throw new Error(`Forbidden: Requires ${permissionName} permission`);
  }
}

/**
 * Synchronize all of a user's database roles to their Clerk publicMetadata.
 * This allows Edge Middleware to instantly read roles without querying the DB.
 */
export async function syncUserRolesToClerk(userId: string) {
  const memberships = await prisma.organizationMember.findMany({
    where: { userId },
    include: { role: true }
  });

  const orgRoles: Record<string, string> = {};
  for (const m of memberships) {
    orgRoles[m.organizationId] = m.role.name;
  }

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      orgRoles
    }
  });
}
