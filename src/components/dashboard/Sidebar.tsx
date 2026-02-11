'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Users, FolderKanban, Plus, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { agents, projects, selectedProject, selectProject, addProject, addActivity, tasks } = useDashboardStore();
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  
  const workingAgents = agents.filter(a => a.status === 'working').length;

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#06b6d4'];
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

  const getProjectTaskCount = (projectId: string) => {
    return tasks.filter(t => t.projectId === projectId).length;
  };
  
  return (
    <TooltipProvider>
      <div className="w-64 border-r bg-card flex flex-col h-full shrink-0">
        {/* Header */}
        <div className="p-4 border-b shrink-0 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-2">
            <motion.span 
              className="text-2xl"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatDelay: 5 }}
            >
              🦦
            </motion.span>
            <div>
              <h1 className="text-lg font-bold">Zayan HQ</h1>
              <p className="text-[10px] text-muted-foreground">
                {agents.length} agents · {workingAgents} actif{workingAgents !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        
        {/* Projects */}
        <div className="p-3 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[10px] font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider">
              <FolderKanban className="w-3 h-3" />
              Projets
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 hover:bg-primary/10 hover:text-primary"
                  onClick={() => setShowNewProject(true)}
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Nouveau projet</TooltipContent>
            </Tooltip>
          </div>
          <div className="space-y-0.5">
            <motion.button
              onClick={() => selectProject(null)}
              className={cn(
                "w-full text-left px-2.5 py-2 rounded-lg text-sm transition-all flex items-center gap-2",
                selectedProject === null 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'hover:bg-muted/80'
              )}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Folder className="w-3.5 h-3.5" />
              <span className="flex-1">Tous les projets</span>
              <span className="text-[10px] opacity-70">{tasks.length}</span>
            </motion.button>
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.button
                  key={project.id}
                  onClick={() => selectProject(project.id)}
                  className={cn(
                    "w-full text-left px-2.5 py-2 rounded-lg text-sm transition-all flex items-center gap-2",
                    selectedProject === project.id 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'hover:bg-muted/80'
                  )}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="w-2.5 h-2.5 rounded shrink-0" 
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="flex-1 truncate">{project.name}</span>
                  <span className="text-[10px] opacity-70">{getProjectTaskCount(project.id)}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        <Separator />
        
        {/* Agents */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="p-3 pb-2 shrink-0">
            <h2 className="text-[10px] font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider">
              <Users className="w-3 h-3" />
              Équipe
            </h2>
          </div>
          <ScrollArea className="flex-1 px-3 pb-3">
            <div className="space-y-1.5">
              {agents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <AgentCard agent={agent} />
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Footer */}
        <div className="p-3 border-t text-center shrink-0">
          <p className="text-[10px] text-muted-foreground">
            v1.0.0 · Made with 🦦
          </p>
        </div>
      </div>

      {/* New Project Dialog */}
      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5" />
              Nouveau projet
            </DialogTitle>
          </DialogHeader>
          <motion.div 
            className="py-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Nom du projet
            </label>
            <Input
              className="mt-1.5"
              placeholder="Ex: Mon super projet"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
              autoFocus
            />
          </motion.div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProject(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
              <Plus className="w-4 h-4 mr-1.5" />
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
