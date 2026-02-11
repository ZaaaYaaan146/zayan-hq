'use client';

import { useDashboardStore } from '@/lib/store';
import { AgentCard } from './AgentCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Users, FolderKanban } from 'lucide-react';

export function Sidebar() {
  const { agents, projects, selectedProject, selectProject } = useDashboardStore();
  
  const workingAgents = agents.filter(a => a.status === 'working').length;
  
  return (
    <div className="w-72 border-r bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold flex items-center gap-2">
          🦦 Zayan HQ
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {agents.length} agents · {workingAgents} actif{workingAgents !== 1 ? 's' : ''}
        </p>
      </div>
      
      {/* Projects */}
      <div className="p-4">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <FolderKanban className="w-4 h-4" />
          Projets
        </h2>
        <div className="space-y-1">
          <button
            onClick={() => selectProject(null)}
            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
              selectedProject === null ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            Tous les projets
          </button>
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => selectProject(project.id)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                selectedProject === project.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: project.color }}
              />
              {project.name}
            </button>
          ))}
        </div>
      </div>
      
      <Separator />
      
      {/* Agents */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 pb-2">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Users className="w-4 h-4" />
            Équipe
          </h2>
        </div>
        <ScrollArea className="flex-1 px-4 pb-4">
          <div className="space-y-3">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
