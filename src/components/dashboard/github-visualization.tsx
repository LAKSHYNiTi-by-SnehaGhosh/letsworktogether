"use client";

import React from "react";
import { GitCommit, GitPullRequest, GitMerge, Activity } from "lucide-react";

export function GithubVisualization() {
  return (
    <div className="h-full flex flex-col bg-card rounded-xl border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-6">
        <Activity size={18} className="text-emerald-500" />
        <h3 className="font-semibold">Live Engineering Activity</h3>
      </div>
      
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        <div className="flex gap-4 p-3 rounded-lg bg-muted/50 border border-border/50">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
            <GitCommit size={16} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-sm font-medium">feat: implement 3d rooms</div>
            <div className="text-xs text-muted-foreground mt-1">user • 2 mins ago</div>
          </div>
        </div>

        <div className="flex gap-4 p-3 rounded-lg bg-muted/50 border border-border/50">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
            <GitPullRequest size={16} className="text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium">PR: Refactor Zustand Store</div>
            <div className="text-xs text-muted-foreground mt-1">user • 15 mins ago</div>
          </div>
        </div>

        <div className="flex gap-4 p-3 rounded-lg bg-muted/50 border border-border/50">
          <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
            <GitMerge size={16} className="text-purple-600" />
          </div>
          <div>
            <div className="text-sm font-medium">Merged #42 into main</div>
            <div className="text-xs text-muted-foreground mt-1">tech-lead-ai • 1 hr ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}
