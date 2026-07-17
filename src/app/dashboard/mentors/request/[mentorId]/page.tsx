import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function MentorRequestPage({ params }: { params: { mentorId: string } }) {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
    include: { projectMemberships: { include: { project: true } } }
  });

  if (!user) redirect("/onboarding");

  // Verify Developer Pro plan
  const isPro = user.subscriptionPlan === "PRO" || user.subscriptionPlan === "ENTERPRISE";
  if (!isPro) redirect("/dashboard/mentors");

  const mentorId = params.mentorId;
  const mentor = await prisma.mentorProfile.findUnique({
    where: { id: mentorId },
    include: { user: { include: { profile: true } } }
  });

  if (!mentor || mentor.approvalStatus !== "APPROVED") {
    redirect("/dashboard/mentors");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Request Mentor Session</h1>
        <p className="text-muted-foreground mt-1">Book a session with {mentor.user.profile?.firstName} for guidance on your project.</p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-muted overflow-hidden shrink-0">
          {mentor.user.profile?.avatarUrl ? (
            <Image src={mentor.user.profile.avatarUrl} alt="Avatar" width={64} height={64} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
              {mentor.user.profile?.firstName?.[0] || 'M'}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg">{mentor.user.profile?.firstName} {mentor.user.profile?.lastName}</h3>
          <p className="text-muted-foreground">{mentor.title}</p>
          <div className="mt-2 font-medium">Hourly Rate: ₹{Number(mentor.hourlyRate)}</div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm p-6">
        <form action="/api/mentors/request" method="POST" className="space-y-6">
          <input type="hidden" name="mentorId" value={mentor.id} />
          <input type="hidden" name="hourlyRate" value={Number(mentor.hourlyRate)} />

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Project (Optional)</label>
            <select name="projectId" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <option value="">No specific project</option>
              {user.projectMemberships.map(p => (
                <option key={p.projectId} value={p.projectId}>{p.project.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Problem Statement</label>
            <textarea 
              name="problemStatement" 
              required 
              rows={4}
              placeholder="Describe what you need help with..."
              className="w-full p-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Required Expertise (comma separated)</label>
            <input 
              name="requiredExpertise" 
              type="text" 
              placeholder="e.g. React, Architecture, Debugging"
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-medium">Total Budget Authorization</div>
              <div className="text-xs text-muted-foreground">You will only be charged when the mentor accepts.</div>
            </div>
            <div className="text-xl font-bold">₹{Number(mentor.hourlyRate)}</div>
          </div>

          <Button type="submit" className="w-full bg-[image:var(--brand-gradient)] text-white shadow-md border-0 h-12 text-lg">
            Submit Request & Pre-Authorize Payment
          </Button>
        </form>
      </div>
    </div>
  );
}
