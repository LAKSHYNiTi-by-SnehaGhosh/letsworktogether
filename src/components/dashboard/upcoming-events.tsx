"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  day: string;
  month: string;
  title: string;
  time: string;
}

export function UpcomingEvents({ events }: { events: Event[] }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg tracking-tight">Upcoming Events</h3>
        <Link href="/dashboard/calendar" className="text-sm text-lwt-blue hover:text-lwt-blue/80 flex items-center gap-1 font-medium transition-colors">
          View calendar <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-4">
            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-lwt-blue/10 text-lwt-blue shrink-0 border border-lwt-blue/20">
              <span className="text-[10px] font-semibold uppercase">{event.month}</span>
              <span className="text-[18px] font-bold leading-none">{event.day}</span>
            </div>
            <div className="flex flex-col justify-center h-12">
              <h4 className="text-[14px] font-semibold text-foreground">{event.title}</h4>
              <p className="text-[12px] text-muted-foreground mt-0.5">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
