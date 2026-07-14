"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart, KanbanSquare, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Analytics", href: `/dashboard/projects/${projectId}`, icon: BarChart, exact: true },
    { name: "Board", href: `/dashboard/projects/${projectId}/board`, icon: KanbanSquare },
    { name: "Timeline", href: `/dashboard/projects/${projectId}/timeline`, icon: Calendar },
    { name: "Members", href: `/dashboard/projects/${projectId}/members`, icon: Users },
  ];

  return (
    <div className="flex gap-6 text-sm font-medium">
      {tabs.map((tab) => {
        const isActive = tab.exact 
          ? pathname === tab.href 
          : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 pb-3 border-b-2 transition-colors",
              isActive 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" /> {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
