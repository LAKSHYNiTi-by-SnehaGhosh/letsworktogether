"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function JoinProjectHandler({ 
  setJoinProjectId, 
  setIsJoinDialogOpen 
}: { 
  setJoinProjectId: (id: string) => void,
  setIsJoinDialogOpen: (open: boolean) => void
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const joinId = searchParams.get("joinId");
    if (joinId) {
      setJoinProjectId(joinId);
      setIsJoinDialogOpen(true);
      
      // Clean up URL without triggering a navigation
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams, setJoinProjectId, setIsJoinDialogOpen]);

  return null;
}
