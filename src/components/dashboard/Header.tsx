'use client';

import { useState } from 'react';
import { useDashboardStore } from '@/lib/store';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, MessageSquare, RefreshCw, LogOut } from 'lucide-react';
import { Task } from '@/types';

export function Header() {
  const { tasks, agents, addTask, addActivity, projects } = useDashboardStore();
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    assignedTo: '',
    projectId: '',
  });
  
  const taskStats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };
  
  const activeAgents = agents.filter(a => a.status === 'working').length;

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'backlog',
      priority: newTask.priority,
      assignedTo: newTask.assignedTo || undefined,
      projectId: newTask.projectId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    };
    
    addTask(task);
    addActivity({
      id: Date.now().toString(),
      agentId: 'zayan',
      type: 'message',
      message: `Nouvelle tâche créée: ${task.title}`,
      timestamp: new Date().toISOString(),
    });
    
    setNewTask({ title: '', description: '', priority: 'medium', assignedTo: '', projectId: '' });
    setShowNewTask(false);
  };
  
  return (
    <>
      <header className="border-b bg-card px-4 py-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-base font-semibold">Task Board</h2>
              <p className="text-xs text-muted-foreground">
                {taskStats.total} tâches · {taskStats.inProgress} en cours · {taskStats.done} terminées
              </p>
            </div>
            
            <Badge variant="outline" className="gap-1 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {activeAgents} actif{activeAgents !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Actualiser
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
              Chat
            </Button>
            <Button size="sm" className="h-7 text-xs" onClick={() => setShowNewTask(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Nouvelle tâche
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle tâche</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Titre de la tâche"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <Textarea
              placeholder="Description (optionnel)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={newTask.priority}
                onValueChange={(v) => setNewTask({ ...newTask, priority: v as Task['priority'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={newTask.assignedTo}
                onValueChange={(v) => setNewTask({ ...newTask, assignedTo: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assigné à" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.emoji} {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select
              value={newTask.projectId}
              onValueChange={(v) => setNewTask({ ...newTask, projectId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Projet (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTask(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateTask}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
