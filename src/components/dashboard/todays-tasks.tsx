"use client";

import React from "react";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
}

export function TodaysTasks({ tasks }: { tasks: Task[] }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg tracking-tight">Today&apos;s Tasks</h3>
        <Link href="/dashboard/tasks" className="text-sm text-lwt-blue hover:text-lwt-blue/80 flex items-center gap-1 font-medium transition-colors">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between group cursor-pointer hover:bg-muted/30 p-2 -mx-2 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center transition-colors", 
                task.completed ? "bg-lwt-blue border-lwt-blue text-white" : "border-border bg-background"
              )}>
                {task.completed && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className={cn("text-[14px] font-medium transition-colors", task.completed ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground")}>
                {task.title}
              </span>
            </div>
            
            {task.priority === "High" && (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20">High</span>
            )}
            {task.priority === "Medium" && (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Medium</span>
            )}
            {task.priority === "Low" && (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-slate-500/10 text-slate-500 border border-slate-500/20">Low</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <button className="flex items-center gap-2 text-sm text-lwt-blue font-medium hover:text-lwt-blue/80 transition-colors">
          <Plus size={16} /> Add new task
        </button>
      </div>
    </div>
  );
}
