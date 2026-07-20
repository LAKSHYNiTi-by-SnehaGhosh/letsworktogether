"use client";

import React, { useState, useTransition } from "react";
import { ArrowRight, Plus, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createTask, toggleTaskCompletion, deleteTask } from "@/actions/task-actions";

interface Task {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
}

export function TodaysTasks({ tasks }: { tasks: Task[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("priority", priority);

    startTransition(async () => {
      try {
        await createTask(formData);
        setTitle("");
        setPriority("Medium");
        setIsAdding(false);
      } catch (error) {
        console.error("Failed to create task", error);
        alert("Could not create task. Please ensure you are assigned to a project.");
      }
    });
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg tracking-tight">Today&apos;s Tasks</h3>
        <Link href="/dashboard/tasks" className="text-sm text-lwt-blue hover:text-lwt-blue/80 flex items-center gap-1 font-medium transition-colors">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between group p-2 -mx-2 rounded-lg transition-colors hover:bg-muted/30">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startTransition(() => {
                    toggleTaskCompletion(task.id, !task.completed);
                  });
                }}
                disabled={isPending}
                className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0", 
                task.completed ? "bg-lwt-blue border-lwt-blue text-white" : "border-border bg-background hover:border-lwt-blue"
              )}>
                {task.completed && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <span className={cn("text-[14px] font-medium transition-colors", task.completed ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground")}>
                {task.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {task.priority === "High" && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">High</span>
              )}
              {task.priority === "Medium" && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">Medium</span>
              )}
              {task.priority === "Low" && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-slate-500/10 text-slate-500 border border-slate-500/20 shrink-0">Low</span>
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  startTransition(() => {
                    deleteTask(task.id);
                  });
                }}
                disabled={isPending}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 p-1 rounded-md hover:bg-red-500/10"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && !isAdding && (
          <div className="text-center text-sm text-muted-foreground py-6">
            No tasks for today. Enjoy your day!
          </div>
        )}

        {isAdding && (
          <form onSubmit={handleSubmit} className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50 space-y-3">
            <input
              type="text"
              autoFocus
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-lwt-blue"
              disabled={isPending}
            />
            <div className="flex items-center justify-between">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="bg-background border border-border rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-lwt-blue"
                disabled={isPending}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-lwt-blue text-white text-xs font-medium px-3 py-1.5 rounded-md hover:bg-lwt-blue/90 disabled:opacity-50 flex items-center gap-1"
                  disabled={isPending || !title.trim()}
                >
                  {isPending && <Loader2 size={12} className="animate-spin" />}
                  Save Task
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {!isAdding && (
        <div className="mt-4 pt-4 border-t border-border/50 shrink-0">
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 text-sm text-lwt-blue font-medium hover:text-lwt-blue/80 transition-colors"
          >
            <Plus size={16} /> Add new task
          </button>
        </div>
      )}
    </div>
  );
}
