"use client";

import React from "react";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AiMentor() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={18} className="text-teal-400" />
        <h3 className="font-semibold text-lg tracking-tight">AI Mentor</h3>
      </div>

      <div className="flex-1 rounded-2xl border border-teal-500/30 bg-gradient-to-b from-teal-500/5 to-transparent p-5 shadow-sm flex flex-col">
        <div className="flex-1">
          <p className="text-[14px] font-medium text-foreground mb-4 leading-relaxed">
            I&apos;ve reviewed your progress.<br />Here are some suggestions:
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2 text-[13px] text-foreground/80 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
              Your documentation is behind by 2 tasks.
            </li>
            <li className="flex items-start gap-2 text-[13px] text-foreground/80 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
              Consider adding error handling in auth module.
            </li>
            <li className="flex items-start gap-2 text-[13px] text-foreground/80 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
              Great job on meeting deadlines!
            </li>
          </ul>
          <Button className="w-full bg-lwt-blue hover:bg-lwt-blue/90 text-white rounded-lg h-9 shadow-sm border-0 font-medium">
            View Detailed Feedback
          </Button>
        </div>
      </div>

      <div className="mt-4 relative">
        <input 
          type="text" 
          placeholder="Ask me anything..." 
          className="w-full h-11 pl-4 pr-12 rounded-xl border border-border/60 bg-card focus:outline-none focus:ring-2 focus:ring-lwt-blue/50 text-sm shadow-sm"
        />
        <button className="absolute right-1.5 top-1.5 w-8 h-8 flex items-center justify-center bg-lwt-blue text-white rounded-lg hover:bg-lwt-blue/90 transition-colors shadow-sm">
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
