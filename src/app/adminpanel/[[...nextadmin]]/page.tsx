import { NextAdmin } from "@premieroctet/next-admin";
import { getNextAdminProps } from "@premieroctet/next-admin/appRouter";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key-please-change-in-production"
);

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("lwt_admin_token")?.value;

  if (!token) {
    redirect("/adminpanel/login");
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload || !payload.adminId) {
      redirect("/adminpanel/login");
    }
    return payload.adminId;
  } catch (error) {
    redirect("/adminpanel/login");
  }
}

export default async function AdminPage(props: any) {
  await requireAdmin();

  const params = await props.params;
  const searchParams = await props.searchParams;

  const nextAdminProps = await getNextAdminProps({
    params: params.nextadmin,
    searchParams,
    basePath: "/adminpanel",
    apiBasePath: "/api/admin",
    prisma,
    options: {
      title: "LAKSHYNiTi Database Admin",
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <NextAdmin {...nextAdminProps} />
    </div>
  );
}
