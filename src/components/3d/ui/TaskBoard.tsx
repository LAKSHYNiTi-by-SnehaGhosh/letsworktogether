import React, { useEffect, useState } from "react";
import { useOfficeStore } from "@/lib/store/office-state";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

export function TaskBoard() {
  const activeProjectId = useOfficeStore(state => state.activeProjectId);
  const refetchTrigger = useOfficeStore(state => state.refetchTrigger);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tasks${activeProjectId ? `?projectId=${activeProjectId}` : ""}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setTasks(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTasks();
    return () => { isMounted = false; };
  }, [activeProjectId, refetchTrigger]);

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await fetch(`/api/tasks/${taskId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_status", status: newStatus })
      });
      useOfficeStore.getState().triggerRefetch();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-[500px] max-h-[600px] overflow-y-auto bg-background/95 backdrop-blur-md rounded-xl border shadow-2xl p-6 pointer-events-auto">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">Assigned Tasks</h2>
      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-muted-foreground text-center py-8">No tasks assigned. Great job!</div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="p-4 border rounded-lg bg-card">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{task.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.status === 'DONE' ? 'bg-green-100 text-green-800' : 
                  task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
              {task.status !== 'DONE' && (
                <div className="flex gap-2">
                  {task.status !== 'IN_PROGRESS' && (
                    <button 
                      onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
                      className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors"
                    >
                      Start Task
                    </button>
                  )}
                  <button 
                    onClick={() => updateTaskStatus(task.id, 'DONE')}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                  >
                    Complete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
