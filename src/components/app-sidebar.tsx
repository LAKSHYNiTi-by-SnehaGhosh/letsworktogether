"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, FolderKanban, Users, BarChart, FileText, Menu, X, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";

const mainLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/team", label: "Team", icon: Users },
];

const workspaceLinks = [
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
  { href: "/dashboard/docs", label: "Documents", icon: FileText },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const renderLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
    const isActive = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setIsOpen(false)}
        className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2 rounded-md transition-colors ${
          isActive
            ? "bg-primary/20 text-primary font-medium"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }`}
        title={isCollapsed ? label : undefined}
      >
        <Icon size={20} className="shrink-0" />
        {!isCollapsed && <span className="text-[15px] whitespace-nowrap overflow-hidden">{label}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 h-20 border-b border-white/10 bg-transparent text-white w-full shrink-0">
        <Link href="/dashboard" className="flex items-center h-full py-3">
          <Image src="/full_icon.png" alt="LWT Workspace" width={400} height={280} className="w-[320px] h-auto object-contain" priority />
        </Link>
        <button onClick={toggleSidebar} className="p-2 text-white">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 ${isCollapsed ? "w-20" : "w-64"} border-r border-white/10 bg-[#040a14] text-white flex flex-col transition-all duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className={`h-24 flex items-center px-4 border-b border-white/10 shrink-0 bg-transparent relative group ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <Link href="/dashboard" className={`flex items-center h-full w-full py-2 ${isCollapsed ? "justify-center" : "justify-start"} transition-opacity duration-200 ${isCollapsed ? "group-hover:opacity-0" : ""}`} onClick={() => setIsOpen(false)}>
            {isCollapsed ? (
              <Image src="/full-icon.png" alt="LWT Workspace" width={90} height={90} className="w-[90px] min-w-[90px] h-auto object-contain" priority />
            ) : (
              <Image src="/full_icon.png" alt="LWT Workspace" width={400} height={280} className="w-[320px] h-auto object-contain" priority />
            )}
          </Link>
          
          {isCollapsed ? (
            <button 
              onClick={() => setIsCollapsed(false)} 
              className="absolute inset-0 m-auto w-10 h-10 hidden md:flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 z-50 rounded-md opacity-0 group-hover:opacity-100 cursor-pointer"
              aria-label="Expand Sidebar"
            >
              <PanelLeftOpen size={24} />
            </button>
          ) : (
            <button 
              onClick={() => setIsCollapsed(true)} 
              className="absolute right-3 top-3 hidden md:flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors z-50 p-1.5 rounded-md cursor-pointer"
              aria-label="Collapse Sidebar"
            >
              <PanelLeftClose size={24} />
            </button>
          )}

          <button onClick={toggleSidebar} className="p-1 text-white md:hidden absolute right-4">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {mainLinks.map(renderLink)}

          <div className={`mt-6 mb-2 px-2 text-xs font-semibold text-white/50 uppercase tracking-wider ${isCollapsed ? "text-center" : ""}`}>
            {isCollapsed ? "..." : "Workspace"}
          </div>
          {workspaceLinks.map(renderLink)}
        </nav>

        <div className={`p-4 border-t border-white/10 flex flex-col ${isCollapsed ? "gap-4 items-center px-2" : "gap-3"} shrink-0`}>
          <div className={`flex ${isCollapsed ? "flex-col items-center gap-4" : "items-center justify-between w-full"}`}>
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}>
              <UserButton />
              {!isCollapsed && (
                <Link href="/dashboard/profile" onClick={() => setIsOpen(false)}>
                  <span className="text-sm font-medium text-white hover:text-primary transition-colors cursor-pointer">Profile</span>
                </Link>
              )}
            </div>
            {!isCollapsed ? (
              <ModeToggle className="text-white hover:bg-white/10 hover:text-white border-0" />
            ) : (
              <ModeToggle className="text-white hover:bg-white/10 hover:text-white border-0 w-8 h-8 rounded-full" />
            )}
          </div>
          
          <SignOutButton redirectUrl="/">
            <button className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2 rounded-md transition-colors text-white/70 hover:bg-destructive/20 hover:text-red-400 w-full ${isCollapsed ? "" : "text-left"}`} title={isCollapsed ? "Log Out" : undefined}>
              <LogOut size={18} className="shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">Log Out</span>}
            </button>
          </SignOutButton>
        </div>
      </aside>
    </>
  );
}
