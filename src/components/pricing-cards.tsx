"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingCardsProps {
  isPro: boolean;
}

export function PricingCards({ isPro }: PricingCardsProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "quarterly" | "half-yearly" | "yearly">("monthly");

  const developerProPrices = {
    monthly: 199,
    quarterly: 399,
    "half-yearly": 999,
    yearly: 1899
  };

  return (
    <div className="w-full">
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full border border-border/50 bg-muted/30 p-1">
          {(["monthly", "quarterly", "half-yearly", "yearly"] as const).map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-4 py-2 sm:px-6 rounded-full text-sm font-medium transition-colors ${
                billingCycle === cycle 
                  ? "bg-background shadow-sm text-foreground border border-border/50" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="capitalize">{cycle.replace("-", " ")}</span>
              {cycle === "yearly" && <span className="ml-2 text-xs text-primary font-bold">SAVE 20%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
        {/* Student Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border/60 bg-card p-8 sm:p-10 shadow-sm relative overflow-hidden h-full flex flex-col"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-semibold">🧑‍🎓 Student</span>
            <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">Free</span>
          </div>
          <p className="text-muted-foreground mb-6">Perfect for students starting their professional journey.</p>
          
          <div className="mb-8">
            <span className="text-5xl font-bold">Free</span>
            <span className="text-muted-foreground ml-2">Forever</span>
          </div>
          
          <div className="mb-10">
            {!isPro ? (
              <Button className="w-full py-6 rounded-xl" variant="outline" disabled>Current Plan</Button>
            ) : (
              <Button className="w-full py-6 rounded-xl" variant="outline" disabled>Free Tier</Button>
            )}
          </div>
          
          <div className="space-y-4 flex-1">
            <div className="font-medium mb-4">Included Features:</div>
            {[
              "AI Workplace Access",
              "1 Workspace",
              "Up to 2 Active Projects",
              "Basic AI Project Manager",
              "Basic AI Mentor",
              "GitHub Integration",
              "Sprint Planning",
              "Task Management",
              "Progress Dashboard",
              "Basic Portfolio",
              "XP & Reputation System",
              "Community Access"
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
            
            <div className="font-medium mt-8 mb-4">Limitations:</div>
            {[
              "Limited AI requests per day",
              "Limited project templates",
              "Basic AI feedback",
              "Basic analytics",
              "Limited portfolio customization",
              "No advanced AI project generation",
              "No premium workplace simulation",
              "No human mentor requests"
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Developer Pro Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-primary/50 bg-card p-8 sm:p-10 shadow-xl relative overflow-hidden group h-full flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-50" />
          {isPro ? (
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg shadow-sm">ACTIVE PLAN</div>
          ) : (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-bl-lg shadow-sm">RECOMMENDED</div>
          )}
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-semibold">💻 Developer Pro</span>
            </div>
            <p className="text-muted-foreground mb-6 text-sm">For developers, freelancers, startup builders, and serious learners.</p>
            
            <div className="mb-8">
              <span className="text-5xl font-bold">₹{developerProPrices[billingCycle]}</span>
              <span className="text-muted-foreground ml-2">/ {billingCycle === "half-yearly" ? "6 months" : billingCycle.replace("ly", "")}</span>
            </div>
            
            <div className="mb-10">
              {!isPro ? (
                <form action="/api/subscriptions/upgrade" method="POST">
                  <Button type="submit" className="w-full py-6 rounded-xl border-0 bg-[image:var(--brand-gradient)] shadow-lg hover:shadow-primary/25 text-white">
                    Upgrade to Pro
                  </Button>
                </form>
              ) : (
                <Button variant="outline" className="w-full py-6 rounded-xl border-border">Manage Subscription</Button>
              )}
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="font-medium mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Everything in Student, plus:</div>
              {[
                "Unlimited Projects",
                "Unlimited AI Usage (Fair Use Policy)",
                "Advanced AI Mentor",
                "Premium AI Project Generation",
                "AI Architecture Review",
                "AI Code Review",
                "AI Documentation Generator",
                "Advanced Workplace Simulation",
                "AI Team Members",
                "GitHub Integration",
                "Advanced Analytics",
                "Resume Builder",
                "Portfolio Website",
                "Career Readiness Reports",
                "Export Reports",
                "Priority AI Processing",
                "Premium Templates",
                "Team Collaboration",
                "Early Access to New Features"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
