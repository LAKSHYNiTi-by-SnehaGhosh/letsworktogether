import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DollarSign, Inbox, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function MentorDashboardPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
    include: {
      mentorProfile: {
        include: {
          requests: {
            include: { student: { include: { profile: true } } },
            orderBy: { createdAt: "desc" }
          },
          wallet: true
        }
      }
    }
  });

  if (!user || !user.mentorProfile) {
    redirect("/dashboard/mentors");
  }

  const profile = user.mentorProfile;

  if (profile.approvalStatus === "PENDING") {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Application Pending</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Your application to become a verified mentor is currently under review by our team. We will notify you once it's approved.
        </p>
      </div>
    );
  }

  if (profile.approvalStatus === "REJECTED") {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Application Rejected</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Unfortunately, your application to become a verified mentor has been rejected.
        </p>
      </div>
    );
  }

  const pendingRequests = profile.requests.filter(r => r.status === "PENDING");
  const acceptedRequests = profile.requests.filter(r => r.status === "ACCEPTED");

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mentor Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your incoming requests and earnings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground font-medium">Available Balance</div>
            <div className="text-2xl font-bold">₹{Number(profile.wallet?.balance || 0)}</div>
          </div>
        </div>
        
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-lwt-blue/10 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-lwt-blue" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground font-medium">Total Earned</div>
            <div className="text-2xl font-bold">₹{Number(profile.wallet?.totalEarned || 0)}</div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
            <Inbox className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground font-medium">Pending Requests</div>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold">Pending Requests</h2>
        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center border border-border rounded-xl bg-card">
            <p className="text-muted-foreground">No pending requests.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map(req => (
              <div key={req.id} className="p-6 border border-border rounded-xl bg-card shadow-sm flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{req.student.profile?.firstName} {req.student.profile?.lastName}</span>
                    <span className="text-sm text-muted-foreground">requested a session</span>
                  </div>
                  <div className="text-sm font-medium mb-2">Problem Statement:</div>
                  <p className="text-sm text-muted-foreground mb-4">{req.problemStatement}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {req.requiredExpertise.map((exp, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-muted rounded-md">{exp}</span>
                    ))}
                  </div>
                  
                  <div className="font-medium text-lwt-blue mt-4">
                    Potential Earning: ₹{Number(req.budget) * 0.8} (Platform fee: 20%)
                  </div>
                </div>
                <div className="flex md:flex-col gap-3 justify-end shrink-0">
                  <form action="/api/mentors/action" method="POST">
                    <input type="hidden" name="requestId" value={req.id} />
                    <input type="hidden" name="action" value="ACCEPT" />
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">Accept</Button>
                  </form>
                  <form action="/api/mentors/action" method="POST">
                    <input type="hidden" name="requestId" value={req.id} />
                    <input type="hidden" name="action" value="REJECT" />
                    <Button type="submit" variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10">Reject</Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold">Upcoming Sessions</h2>
        {acceptedRequests.length === 0 ? (
          <div className="p-8 text-center border border-border rounded-xl bg-card">
            <p className="text-muted-foreground">No upcoming sessions.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {acceptedRequests.map(req => (
              <div key={req.id} className="p-4 border border-border rounded-xl bg-card shadow-sm flex items-center justify-between">
                <div>
                  <span className="font-semibold">{req.student.profile?.firstName} {req.student.profile?.lastName}</span>
                  <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded ml-3">Accepted</span>
                </div>
                <Button variant="outline">Join Workspace</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
