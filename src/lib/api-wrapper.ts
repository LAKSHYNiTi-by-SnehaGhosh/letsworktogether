import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { requirePermission, requireRole } from '@/lib/auth/rbac';

type AuthHandler = (
  req: Request,
  context: { params: Record<string, string | undefined>; userId: string; orgId: string }
) => Promise<Response> | Response;

interface AuthOptions {
  requiredPermission?: string;
  requiredRole?: string;
  requireOrg?: boolean;
}

/**
 * A higher-order wrapper for API Route Handlers.
 * Ensures the user is authenticated, resolves the active organization,
 * and validates database permissions securely before executing the handler.
 */
export function withAuth(handler: AuthHandler, options: AuthOptions = {}) {
  return async (req: Request, { params }: { params: Record<string, string | undefined> }) => {
    try {
      const { userId, orgId: clerkOrgId } = await auth();

      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Resolve the active organization context.
      // E.g., read from URL params if the API is /api/orgs/[orgId]/resource
      // Or fallback to the Clerk native active org ID.
      let orgId: string | undefined | null = params?.orgId || clerkOrgId;

      // If orgId is not explicitly in URL params or Clerk session, check headers
      if (!orgId) {
        orgId = req.headers.get('x-organization-id');
      }

      if (options.requireOrg && !orgId) {
        return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
      }

      // Check granular permission
      if (options.requiredPermission && orgId) {
        await requirePermission(options.requiredPermission, orgId);
      }

      // Check overarching role
      if (options.requiredRole && orgId) {
        await requireRole(options.requiredRole, orgId);
      }

      return await handler(req, { params, userId, orgId: orgId as string });
    } catch (error: unknown) {
      const err = error as Error;
      console.error('[API Auth Error]', err.message);
      
      // Standardize RBAC rejections
      if (err.message.startsWith('Forbidden:')) {
        return NextResponse.json({ error: err.message }, { status: 403 });
      }

      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  };
}
