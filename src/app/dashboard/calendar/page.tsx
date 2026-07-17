import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

export default async function CalendarPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
    include: { projectMemberships: { include: { project: true } } }
  });

  if (!user) redirect("/onboarding");

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground mt-1">Manage your schedule and upcoming project milestones.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-12 shadow-sm text-center">
        <div className="w-16 h-16 bg-lwt-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="w-8 h-8 text-lwt-blue" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          The calendar view is currently under development. Soon you'll be able to see milestones for your {user.projectMemberships.length} active projects here.
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm font-medium">
          <Clock className="w-4 h-4" /> Expected next release
        </div>
      </div>
    </div>
  );
}
