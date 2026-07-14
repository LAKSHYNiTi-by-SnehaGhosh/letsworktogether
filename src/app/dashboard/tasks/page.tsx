"use client";

import { useState, useEffect } from "react";
import { getUserTasks } from "@/app/actions/queries";
import { Loader2, CheckCircle2, Circle } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function MyTasksPage() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserTasks()
      .then(setTasks)
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
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-2">My Tasks</h1>
      <p className="text-muted-foreground mb-8">All tasks assigned to you across all projects.</p>

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-start gap-4 hover:border-primary/50 transition-colors">
            {task.status === "DONE" ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            )}
            <div>
              <p className={`font-medium ${task.status === "DONE" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {task.title}
              </p>
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                <span className="bg-secondary text-secondary-foreground font-medium px-2 py-0.5 rounded-full capitalize">{task.status.replace("_", " ").toLowerCase()}</span>
                {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
              </div>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center p-12 border border-dashed border-border rounded-xl text-muted-foreground">
            No tasks assigned to you right now. Take a break!
          </div>
        )}
      </div>
    </div>
  );
}
