import { Agent, Task, ActivityLog, Project } from '@/types';

export const defaultAgents: Agent[] = [
  {
    id: 'zayan',
    name: 'Zayan',
    role: 'Manager / Architecte',
    emoji: '🦦',
    status: 'idle',
    specialties: ['Architecture', 'Coordination', 'Review', 'Specs'],
    color: '#3b82f6'
  },
  {
    id: 'frontend',
    name: 'Nova',
    role: 'Frontend Developer',
    emoji: '🎨',
    status: 'idle',
    specialties: ['React', 'Next.js', 'Tailwind', 'UI/UX'],
    color: '#ec4899'
  },
  {
    id: 'backend',
    name: 'Atlas',
    role: 'Backend Developer',
    emoji: '⚙️',
    status: 'idle',
    specialties: ['Node.js', 'Python', 'APIs', 'Database'],
    color: '#10b981'
  },
  {
    id: 'devops',
    name: 'Bolt',
    role: 'DevOps Engineer',
    emoji: '🚀',
    status: 'idle',
    specialties: ['Deploy', 'CI/CD', 'Docker', 'Monitoring'],
    color: '#f59e0b'
  },
  {
    id: 'qa',
    name: 'Sentinel',
    role: 'QA / Security',
    emoji: '🧪',
    status: 'idle',
    specialties: ['Testing', 'Security Audit', 'Code Review', 'Bugs'],
    color: '#8b5cf6'
  }
];

export const defaultProjects: Project[] = [
  {
    id: 'signlink',
    name: 'SignLink',
    description: 'Signature de documents en ligne',
    createdAt: new Date().toISOString(),
    color: '#3b82f6'
  }
];

export const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Setup projet Next.js',
    description: 'Initialiser le projet avec la stack choisie',
    status: 'done',
    priority: 'high',
    assignedTo: 'zayan',
    projectId: 'signlink',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    completedAt: new Date(Date.now() - 43200000).toISOString(),
    tags: ['setup', 'infra']
  },
  {
    id: '2',
    title: 'Design système UI',
    description: 'Créer les composants de base et le design system',
    status: 'todo',
    priority: 'high',
    assignedTo: 'frontend',
    projectId: 'signlink',
    createdAt: new Date(Date.now() - 72000000).toISOString(),
    updatedAt: new Date(Date.now() - 36000000).toISOString(),
    tags: ['ui', 'design']
  },
  {
    id: '3',
    title: 'API Authentication',
    description: 'Implémenter auth avec JWT et sessions',
    status: 'backlog',
    priority: 'high',
    assignedTo: 'backend',
    projectId: 'signlink',
    createdAt: new Date(Date.now() - 60000000).toISOString(),
    updatedAt: new Date(Date.now() - 30000000).toISOString(),
    tags: ['api', 'auth', 'security']
  },
  {
    id: '4',
    title: 'Page d\'accueil',
    description: 'Landing page avec hero section et features',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: 'frontend',
    projectId: 'signlink',
    createdAt: new Date(Date.now() - 48000000).toISOString(),
    updatedAt: new Date(Date.now() - 12000000).toISOString(),
    tags: ['ui', 'landing']
  },
  {
    id: '5',
    title: 'Setup CI/CD',
    description: 'Pipeline GitHub Actions pour deploy automatique',
    status: 'backlog',
    priority: 'medium',
    assignedTo: 'devops',
    projectId: 'signlink',
    createdAt: new Date(Date.now() - 36000000).toISOString(),
    updatedAt: new Date(Date.now() - 18000000).toISOString(),
    tags: ['devops', 'ci']
  },
  {
    id: '6',
    title: 'Tests E2E',
    description: 'Setup Playwright et premiers tests',
    status: 'backlog',
    priority: 'low',
    assignedTo: 'qa',
    projectId: 'signlink',
    createdAt: new Date(Date.now() - 24000000).toISOString(),
    updatedAt: new Date(Date.now() - 12000000).toISOString(),
    tags: ['testing', 'e2e']
  }
];

export const sampleActivities: ActivityLog[] = [
  {
    id: '1',
    agentId: 'zayan',
    type: 'message',
    message: 'Dashboard Zayan HQ initialisé',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    agentId: 'zayan',
    type: 'task_completed',
    message: 'Setup projet terminé',
    timestamp: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: '3',
    agentId: 'frontend',
    type: 'task_started',
    message: 'Travail sur la page d\'accueil',
    timestamp: new Date(Date.now() - 12000000).toISOString()
  }
];
