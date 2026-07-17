import { prisma } from "@/lib/prisma";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminMarketplacePage() {
  const pendingMentors = await prisma.mentorProfile.findMany({
    where: { approvalStatus: "PENDING" },
    include: { user: { include: { profile: true } } },
    orderBy: { createdAt: "desc" }
  });

  const approvedMentors = await prisma.mentorProfile.findMany({
    where: { approvalStatus: "APPROVED" },
    include: { user: { include: { profile: true } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace Approvals</h1>
        <p className="text-white/60 mt-2">Manage mentor applications for Let's Work Together.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold border-b border-white/10 pb-2">Pending Applications</h2>
        
        {pendingMentors.length === 0 ? (
          <div className="p-8 text-center border border-white/10 rounded-xl bg-white/5">
            <p className="text-white/50">No pending applications.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingMentors.map(mentor => (
              <div key={mentor.id} className="p-6 border border-white/10 rounded-xl bg-[#0a0a0a] flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{mentor.user.profile?.firstName} {mentor.user.profile?.lastName}</h3>
                      <p className="text-sm text-white/60">{mentor.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-xs text-white/50">Title</span>
                      <div className="font-medium">{mentor.title}</div>
                    </div>
                    <div>
                      <span className="text-xs text-white/50">Experience</span>
                      <div className="font-medium">{mentor.yearsOfExperience} years</div>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-xs text-white/50">Bio</span>
                      <div className="text-sm text-white/80">{mentor.bio}</div>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-xs text-white/50">Skills</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {mentor.skills.map((skill, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-white/10 rounded-md">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-3 justify-end shrink-0">
                  <form action="/api/admin/mentors/action" method="POST">
                    <input type="hidden" name="mentorId" value={mentor.id} />
                    <input type="hidden" name="action" value="APPROVE" />
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </Button>
                  </form>
                  <form action="/api/admin/mentors/action" method="POST">
                    <input type="hidden" name="mentorId" value={mentor.id} />
                    <input type="hidden" name="action" value="REJECT" />
                    <Button type="submit" variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20 gap-2">
                      <XCircle className="w-4 h-4" /> Reject
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold border-b border-white/10 pb-2">Approved Mentors</h2>
        
        {approvedMentors.length === 0 ? (
          <div className="p-8 text-center border border-white/10 rounded-xl bg-white/5">
            <p className="text-white/50">No approved mentors yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {approvedMentors.map(mentor => (
              <div key={mentor.id} className="p-4 border border-white/10 rounded-xl bg-[#0a0a0a] flex items-center justify-between">
                <div>
                  <div className="font-medium">{mentor.user.profile?.firstName} {mentor.user.profile?.lastName}</div>
                  <div className="text-sm text-white/60">{mentor.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">₹{Number(mentor.hourlyRate)}/hr</div>
                  <div className="text-xs text-green-400">Verified</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
