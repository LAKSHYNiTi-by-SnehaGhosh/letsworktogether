import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Building, Globe } from "lucide-react";

export default async function CompaniesPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
    include: { profile: true }
  });

  if (!user) redirect("/onboarding");

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Partner Companies</h1>
        <p className="text-muted-foreground mt-1">Discover verified tech companies and startups hiring on LWT.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-12 shadow-sm text-center">
        <div className="w-16 h-16 bg-lwt-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-lwt-blue" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Company Network Under Construction</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          We are currently onboarding early-stage startups and enterprise partners. Soon you will be able to apply to real companies with your LWT verified portfolio.
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm font-medium">
          <Globe className="w-4 h-4" /> Partner onboarding in progress
        </div>
      </div>
    </div>
  );
}
