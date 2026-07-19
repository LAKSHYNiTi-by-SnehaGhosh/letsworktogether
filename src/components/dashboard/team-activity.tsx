"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Activity {
  id: string;
  userAvatar: string;
  userName: string;
  action: string;
  time: string;
}

export function TeamActivity({ activities }: { activities: Activity[] }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg tracking-tight">Team Activity</h3>
        <Link href="/dashboard/team" className="text-sm text-lwt-blue hover:text-lwt-blue/80 flex items-center gap-1 font-medium transition-colors">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-5 flex-1">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-border/50 bg-muted overflow-hidden shrink-0 relative">
                <Image src={activity.userAvatar} alt={activity.userName} fill className="object-cover" />
              </div>
              <p className="text-[14px] text-foreground/90">
                <span className="font-semibold">{activity.userName}</span> {activity.action}
              </p>
            </div>
            <span className="text-[12px] text-muted-foreground whitespace-nowrap ml-4 shrink-0">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
