"use client";

import { useEffect, useState } from "react";
import { useOfficeStateEngine } from "@/hooks/useOfficeStateEngine";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useOfficeStore, TimeOfDay } from "@/lib/store/office-state";

export function OfficeStateEngineRunner() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const { subscribeToEvents } = useWebSocket();
  const triggerRefetch = useOfficeStore(state => state.triggerRefetch);
  const setTimeOfDay = useOfficeStore(state => state.setTimeOfDay);

  useEffect(() => {
    // Fetch the active project on mount
    fetch("/api/projects/first")
      .then((res) => res.json())
      .then((data) => {
        if (data.projectId) {
          setProjectId(data.projectId);
        }
      })
      .catch((err) => console.error("Failed to fetch first project", err));
  }, []);

  // Listen to remote WebSocket events and trigger global state refetches
  useEffect(() => {
    const unsubscribe = subscribeToEvents((payload) => {
      console.log("WebSocket Event Received:", payload);
      triggerRefetch(); // Trigger UI components to refetch data
    });
    return () => unsubscribe();
  }, [subscribeToEvents, triggerRefetch]);

  // Track Daily Office Cycle
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      const day = new Date().getDay();

      if (day === 0 || day === 6) {
        setTimeOfDay("Weekend");
      } else if (hour >= 6 && hour < 10) {
        setTimeOfDay("Morning");
      } else if (hour >= 10 && hour < 18) {
        setTimeOfDay("WorkHours");
      } else {
        setTimeOfDay("Evening");
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [setTimeOfDay]);

  // The engine will now run for this project ID
  useOfficeStateEngine(projectId);

  return null; // This component doesn't render anything, it just runs the engine
}
