import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ensureUserSynced } from "@/lib/user-sync";
import { Briefcase, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  let clerkUser;
  try {
    clerkUser = await currentUser();
  } catch (authErr) {
    console.error("Clerk auth error in PortfolioPage:", authErr);
    redirect("/sign-in");
  }

  if (!clerkUser) redirect("/sign-in");

  try {
    await ensureUserSynced(clerkUser);

    const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress || "";

    let user = await prisma.user.findUnique({
      where: { id: clerkUser.id },
      include: { profile: true }
    });

    if (!user && primaryEmail) {
      user = await prisma.user.findUnique({
        where: { email: primaryEmail },
        include: { profile: true }
      });
    }

    const firstName = user?.profile?.firstName || clerkUser.firstName || "Developer";

    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio & Resume</h1>
          <p className="text-muted-foreground mt-1">Export your LWT experience directly to your resume.</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-12 shadow-sm text-center">
          <div className="w-16 h-16 bg-lwt-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-lwt-blue" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Build Your Developer Profile</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Hi {firstName}, we are currently building the Portfolio Generator. Soon you will be able to export your project commits, sprint completions, and mentor reviews into a beautiful resume.
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm font-medium">
            <Star className="w-4 h-4" /> Coming in Q4 2026
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering PortfolioPage:", error);
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio & Resume</h1>
          <p className="text-muted-foreground mt-1">Export your LWT experience directly to your resume.</p>
        </div>
      </div>
    );
  }
}
