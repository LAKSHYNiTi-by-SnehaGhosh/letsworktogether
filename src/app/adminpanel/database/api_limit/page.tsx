import { prisma } from "@/lib/prisma";
import { Zap } from "lucide-react";
import AdminApiLimitsTable from "@/components/admin/AdminApiLimitsTable";

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
      aiUsageCount: "desc",
    },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-500" />
          AI Quotas & Limit Enforcement
        </h1>
        <p className="text-white/60">
          Monitor user AI usage, enforce tier limits (Claude/Lovable B2B model), change user subscription plans, and reset monthly API quotas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-white/60 font-medium mb-1">Total Free Users</h3>
          <p className="text-3xl font-bold text-white">
            {users.filter((u) => u.subscriptionPlan === "FREE").length}
          </p>
          <p className="text-xs text-white/40 mt-1">Strict Quota: 50 requests/month</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-white/60 font-medium mb-1">Total Pro Users</h3>
          <p className="text-3xl font-bold text-white">
            {users.filter((u) => u.subscriptionPlan === "PRO").length}
          </p>
          <p className="text-xs text-white/40 mt-1">Quota: 500 requests/month</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-white/60 font-medium mb-1">Total Enterprise Users</h3>
          <p className="text-3xl font-bold text-white">
            {users.filter((u) => u.subscriptionPlan === "ENTERPRISE").length}
          </p>
          <p className="text-xs text-white/40 mt-1">Quota: 5000 requests/month</p>
        </div>
      </div>

      <AdminApiLimitsTable initialUsers={users} />
    </div>
  );
}
