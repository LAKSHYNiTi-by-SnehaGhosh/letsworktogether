import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// Define routes that require administrative access
const isAdminRoute = createRouteMatcher([
  "/dashboard/team/settings(.*)",
  "/dashboard/billing(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  // 1. Enforce Authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // 2. Enforce Edge Authorization (RBAC)
  if (isAdminRoute(req)) {
    const authData = await auth();
    
    // In Clerk, custom claims can be read from sessionClaims
    // Our syncUserRolesToClerk logic pushes DB roles to publicMetadata
    const sessionClaims = authData.sessionClaims as Record<string, unknown>;
    const publicMetadata = (sessionClaims?.publicMetadata || sessionClaims?.metadata || {}) as Record<string, unknown>;
    const orgRoles = (publicMetadata?.orgRoles || {}) as Record<string, string>;
    
    // Attempt to resolve active organization
    // Depending on frontend architecture, this could be from Clerk's native orgId, a cookie, or a URL parameter
    const activeOrgId = authData.orgId || req.cookies.get('activeOrgId')?.value;
    
    if (activeOrgId) {
      const userRole = orgRoles[activeOrgId];
      
      if (userRole !== 'Owner' && userRole !== 'Admin') {
        // Redirect unauthorized users instantly at the edge
        return NextResponse.redirect(new URL('/dashboard?error=unauthorized', req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
