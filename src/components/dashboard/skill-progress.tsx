"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  progress: number;
}

const CircularProgress = ({ progress, label }: { progress: number, label: string }) => {
  const radius = 30;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-muted"
          />
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={cn("transition-all duration-1000 ease-in-out", progress >= 70 ? "text-emerald-500" : progress >= 50 ? "text-lwt-blue" : "text-slate-500")}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-[12px] font-bold text-foreground">{progress}%</span>
      </div>
      <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
    </div>
  );
};

export function SkillProgress({ skills }: { skills: Skill[] }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg tracking-tight">Skill Progress</h3>
        <Link href="/dashboard/skills" className="text-sm text-lwt-blue hover:text-lwt-blue/80 flex items-center gap-1 font-medium transition-colors">
          View all skills <ArrowRight size={14} />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-between gap-2">
        {skills.map((skill, index) => (
          <CircularProgress key={index} progress={skill.progress} label={skill.name} />
        ))}
      </div>
    </div>
  );
}
