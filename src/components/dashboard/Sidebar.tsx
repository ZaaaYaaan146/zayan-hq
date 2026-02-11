'use client';

import { useState } from 'react';
import { useDashboardStore } from '@/lib/store';
import { AgentCard } from './AgentCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Users, FolderKanban, Plus } from 'lucide-react';

export function Sidebar() {
  const { agents, projects, selectedProject, selectProject, addProject, addActivity } = useDashboardStore();
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  
  const workingAgents = agents.filter(a => a.status === 'working').length;

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444'];
    const color = colors[projects.length % colors.length];
    
    addProject({
      id: Date.now().toString(),
      name: newProjectName,
      description: '',
      createdAt: new Date().toISOString(),
      color,
    });
    
    addActivity({
      id: Date.now().toString(),
      agentId: 'zayan',
      type: 'message',
      message: `Nouveau projet créé: ${newProjectName}`,
      timestamp: new Date().toISOString(),
    });
    
    setNewProjectName('');
    setShowNewProject(false);
  };
  
  return (
    <>
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
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
              <FolderKanban className="w-3.5 h-3.5" />
              Projets
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 w-5 p-0"
              onClick={() => setShowNewProject(true)}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
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

      {/* New Project Dialog */}
      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Nouveau projet</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nom du projet"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProject(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateProject}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
