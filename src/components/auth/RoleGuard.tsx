'use client';

import { useSession, useUser } from '@clerk/nextjs';
import React, { ReactNode } from 'react';

/**
 * A client-side hook for programmatic RBAC checks in the browser.
 * Never trust the frontend: this is strictly for UI/UX (e.g., hiding buttons).
 * The server must always re-validate permissions independently.
 */
export function useRBAC() {
  const { session } = useSession();
  const { user } = useUser();

  // The active organization ID can be retrieved from the session or custom state
  // We assume Clerk's native active org or a cookie fallback
  const activeOrgId = session?.lastActiveOrganizationId;

  // Read the cached org roles from the JWT claims that our backend synced
  const publicMetadata = user?.publicMetadata || {};
  const orgRoles: Record<string, string> = (publicMetadata.orgRoles as Record<string, string>) || {};

  const currentRole = activeOrgId ? orgRoles[activeOrgId] : null;

  const hasRole = (role: string) => {
    if (!currentRole) return false;
    // Owners and Admins inherently pass all role checks for lower tiers if needed
    // You can customize this hierarchy
    if (currentRole === 'Owner') return true;
    if (currentRole === 'Admin' && role !== 'Owner') return true;
    return currentRole === role;
  };

  // Note: Granular permissions checks at the client level require injecting permissions into publicMetadata.
  // For now, this hook checks macro-roles.

  return {
    currentRole,
    hasRole,
    activeOrgId,
  };
}

interface RoleGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireRole: string;
}

/**
 * Conditionally renders UI elements based on the user's role in their active organization.
 */
export function RoleGuard({ children, fallback = null, requireRole }: RoleGuardProps) {
  const { isLoaded } = useSession();
  const { hasRole } = useRBAC();

  if (!isLoaded) {
    return null; // Or a loading skeleton
  }

  if (hasRole(requireRole)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
