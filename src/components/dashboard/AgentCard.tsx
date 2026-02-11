'use client';

import { useState } from 'react';
import { Agent } from '@/types';
import { useDashboardStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AgentCardProps {
  agent: Agent;
}

const statusColors = {
  idle: 'bg-gray-500',
  working: 'bg-green-500 animate-pulse',
  done: 'bg-blue-500',
  error: 'bg-red-500'
};

const statusLabels = {
  idle: 'Disponible',
  working: 'En cours',
  done: 'Terminé',
  error: 'Erreur'
};

export function AgentCard({ agent }: AgentCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { tasks, updateAgent, addActivity } = useDashboardStore();
  
  const agentTasks = tasks.filter(t => t.assignedTo === agent.id);
  const activeTasks = agentTasks.filter(t => t.status === 'in_progress');
  const completedTasks = agentTasks.filter(t => t.status === 'done');

  const handleStatusChange = (status: Agent['status']) => {
    updateAgent(agent.id, { status });
    addActivity({
      id: Date.now().toString(),
      agentId: agent.id,
      type: status === 'working' ? 'task_started' : 'message',
      message: `${agent.name} est maintenant ${statusLabels[status].toLowerCase()}`,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <>
      <div 
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg border transition-all hover:bg-muted/50 cursor-pointer"
        )}
        style={{ borderLeftColor: agent.color, borderLeftWidth: '3px' }}
        onClick={() => setShowDetails(true)}
      >
        <span className="text-xl shrink-0">{agent.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-sm truncate">{agent.name}</span>
            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", statusColors[agent.status])} />
          </div>
          <p className="text-xs text-muted-foreground truncate">{agent.role}</p>
        </div>
      </div>

      {/* Agent Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-3xl">{agent.emoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  {agent.name}
                  <div className={cn("w-2 h-2 rounded-full", statusColors[agent.status])} />
                </div>
                <p className="text-sm font-normal text-muted-foreground">{agent.role}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Status */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Statut
              </label>
              <Select value={agent.status} onValueChange={(v) => handleStatusChange(v as Agent['status'])}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idle">🟢 Disponible</SelectItem>
                  <SelectItem value="working">🔵 En cours</SelectItem>
                  <SelectItem value="done">✅ Terminé</SelectItem>
                  <SelectItem value="error">🔴 Erreur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Specialties */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Spécialités
              </label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {agent.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-muted rounded-lg">
                <div className="text-xl font-bold">{agentTasks.length}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="text-center p-2 bg-muted rounded-lg">
                <div className="text-xl font-bold text-blue-500">{activeTasks.length}</div>
                <div className="text-xs text-muted-foreground">En cours</div>
              </div>
              <div className="text-center p-2 bg-muted rounded-lg">
                <div className="text-xl font-bold text-green-500">{completedTasks.length}</div>
                <div className="text-xs text-muted-foreground">Terminées</div>
              </div>
            </div>

            {/* Tasks */}
            {agentTasks.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Tâches assignées
                </label>
                <ScrollArea className="h-[150px] mt-1.5">
                  <div className="space-y-1.5">
                    {agentTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="flex items-center gap-2 p-2 bg-muted rounded text-sm"
                      >
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] px-1.5",
                            task.status === 'done' && 'bg-green-500/10 text-green-500 border-green-500/20',
                            task.status === 'in_progress' && 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          )}
                        >
                          {task.status === 'done' ? '✓' : task.status === 'in_progress' ? '→' : '○'}
                        </Badge>
                        <span className="truncate flex-1">{task.title}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
