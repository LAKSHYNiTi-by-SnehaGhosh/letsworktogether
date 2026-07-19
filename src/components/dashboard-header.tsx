"use client";

import React from "react";
import { Search, Gift, Bell, MessageSquare } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";
import { useOfficeStore } from "@/lib/store/office-state";

export function DashboardHeader() {
  const { user } = useUser();
  const is3DMode = useOfficeStore((state) => state.is3DMode);
  const toggle3DMode = useOfficeStore((state) => state.toggle3DMode);

  return (
    <header className="h-16 border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      <div className="flex-1 flex items-center">
        {/* Search Bar - Hidden on very small screens */}
        <div className="hidden sm:flex relative w-full max-w-md items-center">
          <Search className="absolute left-3 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full h-10 pl-10 pr-12 rounded-full border border-border/60 bg-muted/30 focus:outline-none focus:ring-2 focus:ring-lwt-blue/50 focus:bg-background transition-all text-sm"
          />
          <div className="absolute right-3 flex items-center justify-center bg-background border border-border rounded-md px-1.5 h-6 text-[10px] font-medium text-muted-foreground shadow-sm">
            ⌘K
          </div>
        </div>
        {/* Mobile Search Icon */}
        <button className="sm:hidden p-2 text-foreground/70 hover:text-foreground">
          <Search size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
          <Gift size={16} className="text-lwt-blue" />
          <span>Rewards</span>
        </button>

        <button className="relative p-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
        </button>

        <button className="hidden sm:flex p-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-full transition-colors">
          <MessageSquare size={20} />
        </button>

        <div className="hidden sm:flex items-center border-l border-border/50 pl-4 ml-2">
          <button 
            onClick={toggle3DMode}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted text-sm font-medium text-foreground/80 hover:text-foreground border border-border/50 transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${is3DMode ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`}></span>
            {is3DMode ? "Exit 3D Office" : "Enter 3D Office"}
          </button>
        </div>

        <div className="hidden sm:flex items-center border-l border-border/50 pl-4 ml-2">
          <ModeToggle className="rounded-full w-9 h-9 border-0 hover:bg-muted" />
        </div>

        <div className="flex items-center ml-2 sm:ml-4">
          <UserButton 
            appearance={{ 
              elements: { 
                userButtonAvatarBox: "w-9 h-9 border border-border/50 shadow-sm" 
              } 
            }} 
          />
        </div>
      </div>
    </header>
  );
}
