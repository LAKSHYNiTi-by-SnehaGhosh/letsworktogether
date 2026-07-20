"use client";

import { useState, useEffect, useTransition } from "react";
import { getUserTasks } from "@/app/actions/queries";
import { Loader2, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toggleTaskCompletion, deleteTask } from "@/actions/task-actions";

export default function MyTasksPage() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchTasks = () => {
    if (!user) return;
    getUserTasks()
      .then(setTasks)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
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
          <div key={task.id} className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-start justify-between gap-4 group hover:border-primary/50 transition-colors">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  startTransition(async () => {
                    await toggleTaskCompletion(task.id, task.status !== "DONE");
                    fetchTasks();
                  });
                }}
                disabled={isPending}
                className="mt-0.5 shrink-0 hover:opacity-80 transition-opacity"
              >
                {task.status === "DONE" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
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
            
            <button
              onClick={() => {
                startTransition(async () => {
                  await deleteTask(task.id);
                  fetchTasks();
                });
              }}
              disabled={isPending}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 p-2 rounded-md hover:bg-red-500/10"
            >
              <Trash2 size={16} />
            </button>
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
