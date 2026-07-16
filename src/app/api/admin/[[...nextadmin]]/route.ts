import { createHandler } from "@premieroctet/next-admin/appHandler";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

const { handler } = createHandler({
  apiBasePath: "/api/admin",
  prisma,
  options: {
    title: "LAKSHYNiTi Database Admin",
    basePath: "/adminpanel",
  },
});

async function checkAuth() {
  const user = await currentUser();
  if (!user) return false;
  
  const email = user.emailAddresses[0]?.emailAddress;
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (adminEmail && email !== adminEmail) {
    return false;
  }
  return true;
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
