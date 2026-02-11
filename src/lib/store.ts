import { create } from 'zustand';
import { Agent, Task, ActivityLog, Project } from '@/types';

interface DashboardState {
  agents: Agent[];
  tasks: Task[];
  activities: ActivityLog[];
  projects: Project[];
  selectedProject: string | null;
  
  // Actions
  setAgents: (agents: Agent[]) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTask: (id: string, status: Task['status']) => void;
  deleteTask: (id: string) => void;
  
  addActivity: (activity: ActivityLog) => void;
  setActivities: (activities: ActivityLog[]) => void;
  
  setProjects: (projects: Project[]) => void;
  selectProject: (id: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  agents: [],
  tasks: [],
  activities: [],
  projects: [],
  selectedProject: null,
  
  setAgents: (agents) => set({ agents }),
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map((a) => a.id === id ? { ...a, ...updates } : a)
  })),
  
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
  })),
  moveTask: (id, status) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { 
      ...t, 
      status, 
      updatedAt: new Date().toISOString(),
      completedAt: status === 'done' ? new Date().toISOString() : t.completedAt
    } : t)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id)
  })),
  
  addActivity: (activity) => set((state) => ({
    activities: [activity, ...state.activities].slice(0, 100)
  })),
  setActivities: (activities) => set({ activities }),
  
  setProjects: (projects) => set({ projects }),
  selectProject: (id) => set({ selectedProject: id }),
}));
