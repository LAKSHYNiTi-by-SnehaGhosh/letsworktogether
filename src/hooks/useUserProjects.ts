"use client";

import useSWR from "swr";
import { useState, useCallback } from "react";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
});

export interface ProjectMember {
  id: string;
  userId: string;
  role: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface UserProject {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD" | "ARCHIVED" | string;
  organization: { id: string; name: string } | null;
  team: { id: string; name: string } | null;
  userRole: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER" | string;
  membersCount: number;
  members: ProjectMember[];
  progress: number;
  totalTasks: number;
  completedTasks: number;
  sprintSummary: string;
  aiPmStatus: {
    active: boolean;
    personaCount: number;
    label: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function useUserProjects() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const queryParams = new URLSearchParams();
  if (search) queryParams.set("search", search);
  if (statusFilter !== "ALL") queryParams.set("status", statusFilter);
  queryParams.set("includeArchived", "true");

  const apiUrl = `/api/projects?${queryParams.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<{ projects: UserProject[]; count: number }>(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 10000, // Background refresh every 10 seconds
    }
  );

  const projects = data?.projects || [];

  const refreshProjects = useCallback(() => {
    return mutate();
  }, [mutate]);

  return {
    projects,
    count: projects.length,
    isLoading,
    isError: !!error,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    refreshProjects,
    mutate,
  };
}
