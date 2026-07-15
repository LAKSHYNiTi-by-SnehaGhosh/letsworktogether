"use client";

import React from "react";
import { GitCommit, GitPullRequest, CheckSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContributionData {
  commits: number;
  commitsTrend: string;
  codeReviews: number;
  codeReviewsTrend: string;
  tasksDone: number;
  tasksDoneTrend: string;
  hoursSpent: number;
  hoursSpentTrend: string;
}

export function WeeklyContribution({ data }: { data: ContributionData }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg tracking-tight">Your Contribution This Week</h3>
      </div>

      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatItem 
          icon={<GitCommit size={18} />} 
          label="Commits" 
          value={data.commits.toString()} 
          trend={data.commitsTrend} 
          iconClass="text-blue-500 bg-blue-500/10" 
        />
        <StatItem 
          icon={<GitPullRequest size={18} />} 
          label="Code Reviews" 
          value={data.codeReviews.toString()} 
          trend={data.codeReviewsTrend} 
          iconClass="text-emerald-500 bg-emerald-500/10" 
        />
        <StatItem 
          icon={<CheckSquare size={18} />} 
          label="Tasks Done" 
          value={data.tasksDone.toString()} 
          trend={data.tasksDoneTrend} 
          iconClass="text-teal-500 bg-teal-500/10" 
        />
        <StatItem 
          icon={<Clock size={18} />} 
          label="Hours Spent" 
          value={`${data.hoursSpent}h`} 
          trend={data.hoursSpentTrend} 
          iconClass="text-indigo-500 bg-indigo-500/10" 
        />
      </div>
    </div>
  );
}

function StatItem({ icon, label, value, trend, iconClass }: { icon: React.ReactNode, label: string, value: string, trend: string, iconClass: string }) {
  const isPositive = trend.startsWith("+");
  
  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-border/50", iconClass)}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold">{value}</span>
          <span className={cn("text-[10px] font-semibold", isPositive ? "text-emerald-500" : "text-rose-500")}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}
