"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  iconBgClass?: string;
}

export function StatCard({ title, value, icon, trend, trendUp = true, className, iconBgClass }: StatCardProps) {
  return (
    <div className={cn("rounded-2xl border border-border/50 bg-card p-5 shadow-sm flex items-center justify-between", className)}>
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-medium text-muted-foreground">{title}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{value}</span>
          {trend && (
            <span className={cn("text-xs font-semibold", trendUp ? "text-emerald-500" : "text-rose-500")}>
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0", iconBgClass || "bg-primary/10")}>
        {icon}
      </div>
    </div>
  );
}
