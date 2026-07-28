import React from "react";

export default function DashboardLoading() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="h-9 w-64 bg-muted/60 rounded-xl" />
          <div className="h-5 w-80 bg-muted/40 rounded-lg" />
        </div>
        <div className="hidden md:block h-16 w-80 bg-muted/30 rounded-xl" />
      </div>

      {/* Stats Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-border/40 bg-card/60 p-5 h-28 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-muted/50 rounded" />
              <div className="h-8 w-8 bg-muted/60 rounded-lg" />
            </div>
            <div className="h-8 w-16 bg-muted/70 rounded-md" />
          </div>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-2xl border border-border/40 bg-card/60 p-6 h-96 space-y-4">
          <div className="h-6 w-36 bg-muted/60 rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-20 bg-muted/30 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 rounded-2xl border border-border/40 bg-card/60 p-6 h-96 space-y-4">
          <div className="h-6 w-32 bg-muted/60 rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((k) => (
              <div key={k} className="h-14 bg-muted/30 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-3 rounded-2xl border border-border/40 bg-card/60 p-6 h-96 space-y-4">
          <div className="h-6 w-28 bg-muted/60 rounded" />
          <div className="h-64 bg-muted/20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
