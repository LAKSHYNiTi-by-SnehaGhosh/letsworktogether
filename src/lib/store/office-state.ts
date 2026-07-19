import { create } from 'zustand';

export type ProjectHealth = 'Healthy' | 'At Risk' | 'Critical' | 'Completed';
export type TimeOfDay = 'Morning' | 'WorkHours' | 'Evening' | 'Weekend';

interface OfficeState {
  is3DMode: boolean;
  currentRoom: string;
  projectHealth: ProjectHealth;
  activeProjectId: string | null;
  timeOfDay: TimeOfDay;
  refetchTrigger: number;
  toggle3DMode: () => void;
  setRoom: (room: string) => void;
  setProjectHealth: (health: ProjectHealth) => void;
  setActiveProject: (projectId: string | null) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  triggerRefetch: () => void;
}

export const useOfficeStore = create<OfficeState>((set) => ({
  is3DMode: false,
  currentRoom: "reception",
  projectHealth: "Healthy",
  activeProjectId: null,
  timeOfDay: "WorkHours",
  refetchTrigger: 0,
  toggle3DMode: () => set((state) => ({ is3DMode: !state.is3DMode })),
  setRoom: (room: string) => set({ currentRoom: room }),
  setProjectHealth: (health: ProjectHealth) => set({ projectHealth: health }),
  setActiveProject: (projectId: string | null) => set({ activeProjectId: projectId }),
  setTimeOfDay: (time: TimeOfDay) => set({ timeOfDay: time }),
  triggerRefetch: () => set((state) => ({ refetchTrigger: state.refetchTrigger + 1 })),
}));

