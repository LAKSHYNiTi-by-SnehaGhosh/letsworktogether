import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Search, Star, Briefcase, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default async function MentorsPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
    include: { mentorProfile: true }
  });

  if (!user) redirect("/onboarding");

  // Fetch approved mentors
  const mentors = await prisma.mentorProfile.findMany({
    where: { approvalStatus: "APPROVED", isVerified: true },
    include: { user: { include: { profile: true } } },
    orderBy: { rating: 'desc' }
  });

  const isPro = user.subscriptionPlan === "PRO" || user.subscriptionPlan === "ENTERPRISE";

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentor Marketplace</h1>
          <p className="text-muted-foreground mt-1">Find and book verified industry experts to guide your projects.</p>
        </div>
        
        <div className="flex gap-4">
          {user.mentorProfile ? (
            <Link href="/dashboard/mentor-dashboard">
              <Button variant="outline" className="border-lwt-blue text-lwt-blue">Go to Mentor Dashboard</Button>
            </Link>
          ) : (
            <form action="/api/mentors/apply" method="POST">
              <Button type="submit" variant="secondary">Apply to be a Mentor</Button>
            </form>
          )}
        </div>
      </div>

      {!isPro && (
        <div className="bg-lwt-blue/5 border border-lwt-blue/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lwt-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-lwt-blue mb-1">Elevate Your Journey with Pro</h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              1-on-1 mentorship sessions are exclusively available for Pro members. Upgrade your plan today to unlock personalized guidance from top industry experts and accelerate your career.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link href="/dashboard/billing">
              <Button className="bg-[image:var(--brand-gradient)] border-0 text-white shadow-md hover:opacity-90 w-full sm:w-auto">
                Unlock Mentorship
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search by role, skill, or company..." 
          className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {mentors.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl shadow-sm">
          <Briefcase className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No Mentors Found</h3>
          <p className="text-muted-foreground">Check back later as new mentors are approved.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map(mentor => (
            <div key={mentor.id} className="rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-muted overflow-hidden shrink-0">
                      {mentor.user.profile?.avatarUrl ? (
                        <Image src={mentor.user.profile.avatarUrl} alt="Avatar" width={56} height={56} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                          {mentor.user.profile?.firstName?.[0] || 'M'}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold flex items-center gap-1.5">
                        {mentor.user.profile?.firstName} {mentor.user.profile?.lastName}
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </h3>
                      <p className="text-sm text-muted-foreground">{mentor.title}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-foreground">{Number(mentor.rating || 0).toFixed(1)}</span>
                    <span>({mentor.totalReviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{mentor.yearsOfExperience}y exp</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {mentor.bio || "No bio provided."}
                </p>

                <div className="flex flex-wrap gap-2 mb-2">
                  {mentor.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-md font-medium">
                      {skill}
                    </span>
                  ))}
                  {mentor.skills.length > 3 && (
                    <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-md font-medium">
                      +{mentor.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-lg font-bold">₹{Number(mentor.hourlyRate)}</span>
                  <span className="text-xs text-muted-foreground"> / hour</span>
                </div>
                {isPro ? (
                  <Link href={`/dashboard/mentors/request/${mentor.id}`}>
                    <Button size="sm" className="bg-lwt-blue hover:bg-lwt-blue/90 text-white rounded-lg">Book Session</Button>
                  </Link>
                ) : (
                  <Button size="sm" variant="secondary" disabled>Pro Required</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
