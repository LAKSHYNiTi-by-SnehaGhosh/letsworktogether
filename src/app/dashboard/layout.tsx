import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { WorkspaceProvider } from "@/components/3d/WorkspaceProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <DashboardHeader />
        <main className="flex-1 overflow-hidden relative">
          <WorkspaceProvider>
            <div className="h-full overflow-y-auto bg-muted/10 p-4 sm:p-8">
              {children}
            </div>
          </WorkspaceProvider>
        </main>
      </div>
    </div>
  );
}
