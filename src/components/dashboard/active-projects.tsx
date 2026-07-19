"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  type: string;
  iconUrl?: string;
  progress: number;
  sprint: string;
  dueDate: string;
  members: string[];
}

export function ActiveProjects({ projects }: { projects: Project[] }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg tracking-tight">Active Projects</h3>
        <Link href="/dashboard/projects" className="text-sm text-lwt-blue hover:text-lwt-blue/80 flex items-center gap-1 font-medium transition-colors">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-6 flex-1">
        {projects.map((project) => (
          <div key={project.id} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {project.iconUrl ? (
                  <div className="h-10 w-10 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/50 flex items-center justify-center relative">
                    <Image src={project.iconUrl} alt={project.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-lwt-blue/10 shrink-0 border border-border/50 flex items-center justify-center">
                     <div className="w-5 h-5 bg-lwt-blue rounded-full opacity-50" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-[15px]">{project.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-lwt-blue/10 text-lwt-blue border border-lwt-blue/20">
                      {project.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex -space-x-1.5">
                      {project.members.slice(0, 4).map((member, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border border-background bg-muted overflow-hidden relative">
                          <Image src={member} alt="Member" fill className="object-cover" />
                        </div>
                      ))}
                      {project.members.length > 4 && (
                        <div className="w-5 h-5 rounded-full border border-background bg-muted flex items-center justify-center text-[8px] font-medium text-foreground">
                          +{project.members.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold block">{project.sprint}</span>
                <span className="text-[11px] text-muted-foreground">Due in {project.dueDate}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500", project.progress >= 70 ? "bg-emerald-500" : "bg-lwt-blue")} 
                  style={{ width: `${project.progress}%` }} 
                />
              </div>
              <span className="text-[11px] font-semibold text-foreground/70 min-w-[28px]">{project.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
