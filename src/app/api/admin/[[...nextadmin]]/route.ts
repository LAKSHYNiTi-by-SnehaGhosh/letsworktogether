import { createHandler } from "@premieroctet/next-admin/appHandler";
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key-please-change-in-production"
);

const { handler } = createHandler({
  apiBasePath: "/api/admin",
  prisma,
  options: {
    title: "LAKSHYNiTi Database Admin",
    basePath: "/adminpanel",
  },
});

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("lwt_admin_token")?.value;

  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload || !payload.adminId) return false;
    return true;
  } catch (error) {
    return false;
  }
}

export async function GET(req: NextRequest, ctx: any) {
  if (!(await checkAuth())) return new NextResponse("Unauthorized", { status: 401 });
  return handler(req, ctx);
}

export async function POST(req: NextRequest, ctx: any) {
  if (!(await checkAuth())) return new NextResponse("Unauthorized", { status: 401 });
  return handler(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: any) {
  if (!(await checkAuth())) return new NextResponse("Unauthorized", { status: 401 });
  return handler(req, ctx);
}

export async function PUT(req: NextRequest, ctx: any) {
  if (!(await checkAuth())) return new NextResponse("Unauthorized", { status: 401 });
  return handler(req, ctx);
}
