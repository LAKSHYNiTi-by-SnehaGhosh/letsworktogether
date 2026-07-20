import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CreditCard, Sparkles, AlertCircle } from "lucide-react";
import { PricingCards } from "@/components/pricing-cards";

export default async function BillingDashboard() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: clerkUser.id },
    include: { subscription: true }
  });

  if (!user) redirect("/onboarding");

  // Determine current plan from DB (fallback to FREE/Student)
  const isPro = user.subscriptionPlan === "PRO" || user.subscriptionPlan === "ENTERPRISE";

  // Calculate AI usage percentage
  const usagePercentage = Math.min(100, Math.round((user.aiUsageCount / Math.max(1, user.aiTotalLimit)) * 100));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscriptions</h1>
        <p className="text-muted-foreground mt-1">Manage your plan, limits, and payment methods.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Payment History */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              Payment History
            </h2>
            {isPro ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                  <div>
                    <div className="font-medium text-sm">Developer Pro (Monthly)</div>
                    <div className="text-xs text-muted-foreground">July 17, 2026</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">₹199</span>
                    <span className="bg-green-500/10 text-green-500 text-xs px-2 py-0.5 rounded-md font-medium">Paid</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No payment history available for the free plan.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar limits */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lwt-blue" />
              AI Usage
            </h2>
            
            <div className="space-y-2 mb-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Requests</span>
                <span className="font-medium">{user.aiUsageCount} / {isPro ? "∞" : user.aiTotalLimit}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${usagePercentage > 90 ? 'bg-red-500' : 'bg-lwt-blue'}`} 
                  style={{ width: `${isPro ? 10 : usagePercentage}%` }}
                />
              </div>
            </div>
            
            {!isPro && usagePercentage > 80 && (
              <div className="mt-4 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg p-3 text-xs flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>You are approaching your AI limit. Upgrade to Developer Pro for unlimited access.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <h2 className="text-2xl font-bold tracking-tight mb-8">Available Plans</h2>
        <PricingCards isPro={isPro} />
      </div>
    </div>
  );
}
