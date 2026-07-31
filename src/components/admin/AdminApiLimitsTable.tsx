"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw, Edit2, Loader2 } from "lucide-react";

interface AdminApiLimitsTableProps {
  initialUsers: any[];
}

export default function AdminApiLimitsTable({ initialUsers }: AdminApiLimitsTableProps) {
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleResetUsage = async (userId: string) => {
    if (!confirm("Reset AI Usage count to 0 for this user?")) return;
    setLoadingId(userId);
    try {
      const res = await fetch("/api/admin/quotas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "reset_usage" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, aiUsageCount: 0 } : u))
        );
      } else {
        alert(data.error || "Failed to reset usage");
      }
    } catch (err) {
      console.error(err);
      alert("Error resetting usage");
    } finally {
      setLoadingId(null);
    }
  };

  const handlePlanChange = async (userId: string, subscriptionPlan: string) => {
    setLoadingId(userId);
    try {
      let defaultLimit = 50;
      if (subscriptionPlan === "PRO") defaultLimit = 500;
      if (subscriptionPlan === "ENTERPRISE") defaultLimit = 5000;

      const res = await fetch("/api/admin/quotas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "update_plan", subscriptionPlan, aiTotalLimit: defaultLimit }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, subscriptionPlan, aiTotalLimit: defaultLimit } : u
          )
        );
      } else {
        alert(data.error || "Failed to update plan");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating plan");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCustomLimit = async (userId: string, currentLimit: number) => {
    const newLimitStr = prompt("Enter new AI quota request limit:", currentLimit.toString());
    if (!newLimitStr) return;
    const newLimit = parseInt(newLimitStr);
    if (isNaN(newLimit) || newLimit < 0) return alert("Invalid limit number");

    setLoadingId(userId);
    try {
      const res = await fetch("/api/admin/quotas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "update_limit", aiTotalLimit: newLimit }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, aiTotalLimit: newLimit } : u))
        );
      } else {
        alert(data.error || "Failed to update limit");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating limit");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 border-b border-white/10 text-white/60 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">User Email</th>
              <th className="px-6 py-4 font-semibold">Subscription Plan</th>
              <th className="px-6 py-4 font-semibold">AI Usage / Quota</th>
              <th className="px-6 py-4 font-semibold">Quota Status</th>
              <th className="px-6 py-4 font-semibold">Reset Date</th>
              <th className="px-6 py-4 font-semibold text-right">Admin Quota Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/80">
            {users.map((user) => {
              const limit = user.aiTotalLimit || 50;
              const percentage = Math.round((user.aiUsageCount / limit) * 100);
              const isCapped = user.aiUsageCount >= limit;
              const isLoading = loadingId === user.id;

              return (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">
                    {user.email}
                  </td>

                  {/* Plan Selector */}
                  <td className="px-6 py-4">
                    <select
                      value={user.subscriptionPlan || "FREE"}
                      onChange={(e) => handlePlanChange(user.id, e.target.value)}
                      disabled={isLoading}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border bg-transparent cursor-pointer ${
                        user.subscriptionPlan === "PRO"
                          ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                          : user.subscriptionPlan === "ENTERPRISE"
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          : "bg-white/10 text-white/70 border-white/10"
                      }`}
                    >
                      <option value="FREE" className="bg-[#0a0a0a]">FREE (50 Quota)</option>
                      <option value="PRO" className="bg-[#0a0a0a]">PRO (500 Quota)</option>
                      <option value="ENTERPRISE" className="bg-[#0a0a0a]">ENTERPRISE (5000 Quota)</option>
                    </select>
                  </td>

                  {/* Usage Bar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden w-28">
                        <div
                          className={`h-full rounded-full ${isCapped ? "bg-red-500" : "bg-emerald-500"}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <span className="text-white/70 text-xs font-mono">
                        {user.aiUsageCount} / {limit}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {isCapped ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        <AlertTriangle className="w-3.5 h-3.5" /> Quota Reached
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    )}
                  </td>

                  {/* Reset Date */}
                  <td className="px-6 py-4 text-white/50 text-xs whitespace-nowrap">
                    {user.aiUsageResetDate
                      ? new Date(user.aiUsageResetDate).toLocaleDateString()
                      : "Monthly Cycle"}
                  </td>

                  {/* Quota Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleCustomLimit(user.id, limit)}
                        disabled={isLoading}
                        className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                        title="Edit Custom AI Limit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleResetUsage(user.id)}
                        disabled={isLoading}
                        className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg hover:bg-amber-500/20 transition-colors flex items-center gap-1"
                        title="Reset Usage Count to 0"
                      >
                        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                        Reset Count
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-white/50">
                  No users found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
