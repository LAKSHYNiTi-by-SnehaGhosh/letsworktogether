import React, { useEffect, useState } from "react";
import { useOfficeStore } from "@/lib/store/office-state";
import { BarChart3, TrendingUp, Activity } from "lucide-react";

export function AnalyticsDashboard() {
  const activeProjectId = useOfficeStore(state => state.activeProjectId);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!activeProjectId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/analytics?projectId=${activeProjectId}`);
        if (res.ok) setData(await res.json());
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [activeProjectId]);

  return (
    <div className="w-[800px] h-[500px] bg-background/95 backdrop-blur-md rounded-xl border shadow-2xl p-6 pointer-events-auto flex flex-col">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <BarChart3 className="text-primary" />
        <h2 className="text-2xl font-bold">Analytics Wall</h2>
      </div>

      {loading ? (
        <div className="flex-1 animate-pulse bg-muted rounded-lg w-full"></div>
      ) : !data ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">Select a project to view analytics.</div>
      ) : (
        <div className="flex-1 grid grid-cols-3 gap-6">
          <div className="col-span-1 space-y-4">
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-2"><TrendingUp size={16}/> Sprint Progress</div>
              <div className="text-4xl font-bold">{data.progress}%</div>
              <div className="w-full bg-secondary h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-primary h-full" style={{ width: `${data.progress}%` }}></div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold text-muted-foreground mb-2">Tasks Completed</div>
              <div className="text-3xl font-bold text-green-600">{data.completedTasks} <span className="text-lg text-muted-foreground font-normal">/ {data.totalTasks}</span></div>
            </div>
            
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold text-muted-foreground mb-2">Team Velocity</div>
              <div className="text-3xl font-bold text-blue-600">{data.velocity} <span className="text-lg text-muted-foreground font-normal">pts</span></div>
            </div>
          </div>
          
          <div className="col-span-2 bg-card border rounded-lg p-4 shadow-sm flex flex-col">
            <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-4"><Activity size={16}/> Repository Health: {data.repositoryHealth}</div>
            <div className="flex-1 relative border-l border-b border-border ml-6 mb-6">
              {/* Mock Bar Chart */}
              <div className="absolute bottom-0 left-4 w-12 bg-blue-500 rounded-t" style={{ height: '30%' }}></div>
              <div className="absolute bottom-0 left-24 w-12 bg-blue-500 rounded-t" style={{ height: '50%' }}></div>
              <div className="absolute bottom-0 left-44 w-12 bg-blue-500 rounded-t" style={{ height: '40%' }}></div>
              <div className="absolute bottom-0 left-64 w-12 bg-blue-500 rounded-t" style={{ height: '70%' }}></div>
              <div className="absolute bottom-0 left-84 w-12 bg-primary rounded-t" style={{ height: `${Math.max(10, data.progress)}%` }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
