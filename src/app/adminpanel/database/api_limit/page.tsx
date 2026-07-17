import { prisma } from "@/lib/prisma";
import { Zap, AlertTriangle, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function APILimitsPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      subscriptionPlan: true,
      aiUsageCount: true,
      aiTotalLimit: true,
      aiUsageResetDate: true,
    },
    orderBy: {
      aiUsageCount: 'desc'
    }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-500" />
          AI Quotas & Limits
        </h1>
        <p className="text-white/60">
          Monitor user AI usage, track subscription plans, and manage API quotas across the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-white/60 font-medium mb-1">Total Free Users</h3>
          <p className="text-3xl font-bold text-white">
            {users.filter(u => u.subscriptionPlan === 'FREE').length}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-white/60 font-medium mb-1">Total Pro Users</h3>
          <p className="text-3xl font-bold text-white">
            {users.filter(u => u.subscriptionPlan === 'PRO').length}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-white/60 font-medium mb-1">Total Enterprise Users</h3>
          <p className="text-3xl font-bold text-white">
            {users.filter(u => u.subscriptionPlan === 'ENTERPRISE').length}
          </p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-white/60 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">User Email</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Usage</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Next Reset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => {
                const percentage = (user.aiUsageCount / user.aiTotalLimit) * 100;
                const isCapped = user.aiUsageCount >= user.aiTotalLimit;
                
                return (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.subscriptionPlan === 'PRO' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                        user.subscriptionPlan === 'ENTERPRISE' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        'bg-white/10 text-white/70 border border-white/10'
                      }`}>
                        {user.subscriptionPlan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden w-24">
                          <div 
                            className={`h-full rounded-full ${isCapped ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <span className="text-white/70 text-xs w-12 text-right">
                          {user.aiUsageCount} / {user.aiTotalLimit}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isCapped ? (
                        <div className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
                          <AlertTriangle className="w-4 h-4" /> Limit Reached
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Active
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white/50 text-xs">
                      {user.aiUsageResetDate ? new Date(user.aiUsageResetDate).toLocaleDateString() : "End of Billing Cycle"}
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-white/50">
                    No users found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
