import { useEffect, useState } from "react";
import { useOfficeStore, ProjectHealth } from "@/lib/store/office-state";

export function useOfficeStateEngine(projectId: string | null) {
  const setProjectHealth = useOfficeStore((state) => state.setProjectHealth);
  const setActiveProject = useOfficeStore((state) => state.setActiveProject);
  const currentHealth = useOfficeStore((state) => state.projectHealth);
  const [metrics, setMetrics] = useState({ total: 0, completed: 0, overdue: 0 });

  useEffect(() => {
    setActiveProject(projectId);
    
    if (!projectId) return;

    // Polling function for project health
    const fetchHealth = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/health`);
        if (res.ok) {
          const data = await res.json();
          setProjectHealth(data.health as ProjectHealth);
          setMetrics({
            total: data.metrics.totalTasks,
            completed: data.metrics.completedTasks,
            overdue: data.metrics.overdueTasks,
          });
        }
      } catch (error) {
        console.error("Failed to fetch project health", error);
      }
    };

    // Initial fetch
    fetchHealth();

    // Poll every 10 seconds
    const interval = setInterval(fetchHealth, 10000);

    return () => clearInterval(interval);
  }, [projectId, setActiveProject, setProjectHealth]);

  return { health: currentHealth, metrics };
}
