import { NextAdmin } from "@premieroctet/next-admin";
import { getPropsFromAppRouter } from "@premieroctet/next-admin/appRouter";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import "@premieroctet/next-admin/dist/styles.css";

async function requireAdmin() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  
  const email = user.emailAddresses[0]?.emailAddress;
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (adminEmail && email !== adminEmail) {
    redirect("/dashboard");
  }
}

export default async function AdminPage(props: any) {
  await requireAdmin();

  // Handle Promise-based params for Next.js 15+ compatibility
  const params = await props.params;
  const searchParams = await props.searchParams;

  const nextAdminProps = await getPropsFromAppRouter({
    req: { params, searchParams },
    prisma,
    options: {
      title: "LAKSHYNiTi Database Admin",
      basePath: "/adminpanel",
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <NextAdmin {...nextAdminProps} />
    </div>
  );
}
