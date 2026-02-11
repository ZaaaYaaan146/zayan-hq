export type AgentStatus = 'idle' | 'working' | 'done' | 'error';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  status: AgentStatus;
  currentTask?: string;
  specialties: string[];
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  color: string;
}

export interface ActivityLog {
  id: string;
  agentId: string;
  type: 'task_started' | 'task_completed' | 'task_failed' | 'message' | 'deploy' | 'commit';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
