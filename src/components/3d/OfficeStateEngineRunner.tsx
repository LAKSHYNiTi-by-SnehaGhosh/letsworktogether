"use client";

import { useEffect, useState } from "react";
import { useOfficeStateEngine } from "@/hooks/useOfficeStateEngine";

export function OfficeStateEngineRunner() {
  const [projectId, setProjectId] = useState<string | null>(null);

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

  // The engine will now run for this project ID
  useOfficeStateEngine(projectId);

  return null; // This component doesn't render anything, it just runs the engine
}
