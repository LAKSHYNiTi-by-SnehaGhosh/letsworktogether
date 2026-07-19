import { create } from 'zustand';

export type ProjectHealth = 'Healthy' | 'At Risk' | 'Critical' | 'Completed';

interface OfficeState {
  is3DMode: boolean;
  currentRoom: string;
  projectHealth: ProjectHealth;
  activeProjectId: string | null;
  toggle3DMode: () => void;
  setRoom: (room: string) => void;
  setProjectHealth: (health: ProjectHealth) => void;
  setActiveProject: (projectId: string | null) => void;
}

export const useOfficeStore = create<OfficeState>((set) => ({
  is3DMode: false, // Default to 2D dashboard
  currentRoom: "reception",
  projectHealth: "Healthy",
  activeProjectId: null,
  toggle3DMode: () => set((state) => ({ is3DMode: !state.is3DMode })),
  setRoom: (room: string) => set({ currentRoom: room }),
  setProjectHealth: (health: ProjectHealth) => set({ projectHealth: health }),
  setActiveProject: (projectId: string | null) => set({ activeProjectId: projectId }),
}));
