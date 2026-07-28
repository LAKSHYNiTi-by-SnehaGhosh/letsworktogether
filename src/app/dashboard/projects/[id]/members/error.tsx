"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectMembersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Project Members Error Boundary caught exception:", error);
  }, [error]);

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
        <AlertTriangle className="h-10 w-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Unable to Load Project Members
        </h2>
        <p className="text-sm text-muted-foreground">
          {error.message && !error.message.includes("digest")
            ? error.message
            : "An unexpected error occurred while loading project members. Please check your project access and try again."}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button onClick={() => reset()} className="gap-2 bg-[image:var(--brand-gradient)] text-white shadow-md">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
        <Button variant="outline" asChild className="gap-2">
          <Link href="/dashboard/projects">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>
        </Button>
      </div>
    </div>
  );
}
