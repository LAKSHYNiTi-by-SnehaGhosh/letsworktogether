"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FolderKanban, Users, Sparkles, CheckSquare, 
  Calendar, BarChart, Briefcase, Building, Plus, UserPlus, 
  Bot, Menu, X, PanelLeftClose, PanelLeftOpen, LucideIcon 
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/team", label: "Teams", icon: Users },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/dashboard/companies", label: "Companies", icon: Building },
  { href: "/dashboard/mentors", label: "Mentor Market", icon: Users },
  { href: "/dashboard/billing", label: "Billing", icon: Briefcase },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useUser();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const renderLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) => {
    const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setIsOpen(false)}
        className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg transition-colors ${
          isActive
            ? "bg-lwt-blue/10 text-lwt-blue font-medium shadow-sm"
            : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
        }`}
        title={isCollapsed ? label : undefined}
      >
        <Icon size={20} className={isActive ? "text-lwt-blue" : "text-slate-400"} />
        {!isCollapsed && <span className="text-[14px] whitespace-nowrap overflow-hidden font-medium">{label}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 h-16 border-b border-slate-800 bg-[#0F172A] w-full shrink-0 z-40 sticky top-0">
        <Link href="/dashboard" className="flex items-center">
          <Image src="/main_icon.png" alt="LWT Workspace" width={100} height={40} className="h-8 w-auto object-contain" priority />
        </Link>
        <button onClick={toggleSidebar} className="p-2 text-slate-300 hover:text-white transition-colors">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 ${isCollapsed ? "w-20" : "w-64"} border-r border-slate-800 bg-[#0F172A] text-slate-200 flex flex-col transition-all duration-300 md:static md:translate-x-0 shadow-sm ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className={`h-20 flex items-center px-4 shrink-0 relative group ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <Link href="/dashboard" className={`flex items-center h-full w-full py-2 ${isCollapsed ? "justify-center" : "justify-start"} transition-opacity duration-200 ${isCollapsed ? "group-hover:opacity-0" : ""}`} onClick={() => setIsOpen(false)}>
            <Image src="/main_icon.png" alt="LWT Workspace" width={120} height={50} className={`${isCollapsed ? "w-12" : "w-[100px]"} h-auto object-contain transition-all duration-300`} priority />
          </Link>
          
          {isCollapsed ? (
            <button 
              onClick={() => setIsCollapsed(false)} 
              className="absolute inset-0 m-auto w-8 h-8 hidden md:flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 z-50 rounded-md opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm border border-slate-700 bg-[#0F172A]"
              aria-label="Expand Sidebar"
            >
              <PanelLeftOpen size={18} />
            </button>
          ) : (
            <button 
              onClick={() => setIsCollapsed(true)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-50 w-8 h-8 rounded-md cursor-pointer shadow-sm border border-slate-700 bg-[#0F172A] opacity-0 group-hover:opacity-100"
              aria-label="Collapse Sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          )}

          <button onClick={toggleSidebar} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-md md:hidden absolute right-3 top-1/2 -translate-y-1/2 transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1 scrollbar-none">
          {sidebarLinks.map(renderLink)}

          {!isCollapsed && (
            <div className="mt-8 mb-4 px-3">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} className="text-lwt-blue" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Actions</span>
              </div>
              <div className="space-y-2">
                <Link href="/dashboard/projects" className="block w-full">
                  <Button className="w-full justify-start gap-2 bg-lwt-blue hover:bg-lwt-blue/90 text-white rounded-lg h-10 shadow-sm border-0">
                    <Plus size={16} /> Create Project
                  </Button>
                </Link>
                <Link href="/dashboard/projects" className="block w-full">
                  <Button variant="outline" className="w-full justify-start gap-2 border-slate-700 bg-transparent hover:bg-white/5 text-slate-300 rounded-lg h-10 shadow-sm">
                    <UserPlus size={16} /> Join Project
                  </Button>
                </Link>
                <Link href="/dashboard/projects" className="block w-full">
                  <Button variant="outline" className="w-full justify-start gap-2 border-slate-700 bg-transparent hover:bg-white/5 text-slate-300 rounded-lg h-10 shadow-sm">
                    <Bot size={16} /> AI Project Planner
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800 flex flex-col gap-3 shrink-0 bg-[#0B1121]">
          <div className={`flex items-center ${isCollapsed ? "flex-col gap-4" : "justify-between"} w-full`}>
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 w-full overflow-hidden"}`}>
              <UserButton 
                appearance={{ 
                  elements: { 
                    userButtonAvatarBox: "w-9 h-9 border border-slate-700 shadow-sm" 
                  } 
                }} 
              />
              {!isCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-sm font-semibold text-white truncate">{user?.fullName || "User"}</span>
                  <span className="text-[11px] text-slate-400 font-medium truncate capitalize">Student</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
