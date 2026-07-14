"use client";

import { Zap, Clock, CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserDashboardData } from "@/app/actions/queries";

export default function DashboardPage() {
  const { user } = useUser();
  const [showAiSuggestion, setShowAiSuggestion] = useState(true);

  const [activeProjects, setActiveProjects] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [recentActivities, setRecentActivities] = useState<Array<{ id: string, title: string, status: string, updatedAt?: Date | null, createdAt: Date }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    getUserDashboardData()
      .then((data) => {
        setActiveProjects(data.activeProjects);
        setTasksCompleted(data.tasksCompleted);
        setRecentActivities(data.recentActivities);
      })
      .catch((error) => console.error("Error fetching dashboard data:", error))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-lwt-blue" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Good morning{user?.firstName ? `, ${user.firstName}` : ""}.</h1>
        <p className="text-muted-foreground mt-1">Here is a summary of your live workspace.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard title="Active Projects" value={activeProjects.toString()} icon={<Zap className="h-4 w-4 text-primary" />} />
        <StatCard title="Tasks Completed" value={tasksCompleted.toString()} icon={<CheckCircle className="h-4 w-4 text-green-500" />} />
        <StatCard title="Tasks Pending" value={(recentActivities.length - tasksCompleted).toString()} icon={<Clock className="h-4 w-4 text-blue-500" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm col-span-4">
          <h3 className="font-semibold mb-4 text-lg">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
               <p className="text-sm text-muted-foreground">No recent tasks. Start your first project!</p>
            ) : (
              recentActivities.map((task) => (
                <ActivityItem 
                  key={task.id} 
                  title={task.title} 
                  status={task.status} 
                  time={new Date(task.updatedAt || task.createdAt).toLocaleDateString()} 
                />
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm col-span-3">
          <h3 className="font-semibold mb-4 text-lg">AI Mentor Suggestions</h3>
          
          {showAiSuggestion ? (
            <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
              <p className="text-sm text-foreground/80 leading-relaxed">
                Connect the GEMINI API KEY to start getting contextual feedback on your tasks, automated sprint generation, and code reviews!
              </p>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => alert("Please provide the GEMINI_API_KEY to enable AI Generation.")}
                  className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-medium"
                >
                  Enable AI
                </button>
                <button 
                  onClick={() => setShowAiSuggestion(false)}
                  className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-md font-medium hover:bg-muted/80"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center py-8 text-center">
               <p className="text-sm text-muted-foreground">No new suggestions at the moment.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon}
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

function ActivityItem({ title, status, time }: { title: string, status: string, time: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">Status: {status}</p>
      </div>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  );
}
