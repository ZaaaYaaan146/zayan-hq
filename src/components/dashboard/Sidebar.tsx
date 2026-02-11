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
    <div className="w-64 border-r bg-card flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-3 border-b shrink-0">
        <h1 className="text-lg font-bold flex items-center gap-2">
          🦦 Zayan HQ
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {agents.length} agents · {workingAgents} actif{workingAgents !== 1 ? 's' : ''}
        </p>
      </div>
      
      {/* Projects */}
      <div className="p-3 shrink-0">
        <h2 className="text-xs font-semibold flex items-center gap-1.5 mb-2 text-muted-foreground uppercase tracking-wide">
          <FolderKanban className="w-3.5 h-3.5" />
          Projets
        </h2>
        <div className="space-y-0.5">
          <button
            onClick={() => selectProject(null)}
            className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
              selectedProject === null ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            Tous les projets
          </button>
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => selectProject(project.id)}
              className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors flex items-center gap-2 ${
                selectedProject === project.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <div 
                className="w-2 h-2 rounded-full shrink-0" 
                style={{ backgroundColor: project.color }}
              />
              {project.name}
            </button>
          ))}
        </div>
      </div>
      
      <Separator />
      
      {/* Agents */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="p-3 pb-1.5 shrink-0">
          <h2 className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
            <Users className="w-3.5 h-3.5" />
            Équipe
          </h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1.5 px-3 pb-3">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
