'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AgentCardProps {
  agent: Agent;
}

const statusColors = {
  idle: 'bg-gray-400',
  working: 'bg-green-500',
  done: 'bg-blue-500',
  error: 'bg-red-500'
};

const statusGlow = {
  idle: '',
  working: 'shadow-[0_0_8px_rgba(34,197,94,0.5)]',
  done: '',
  error: 'shadow-[0_0_8px_rgba(239,68,68,0.5)]'
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div 
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer",
              "hover:bg-muted/50 hover:border-primary/30"
            )}
            style={{ borderLeftColor: agent.color, borderLeftWidth: '3px' }}
            onClick={() => setShowDetails(true)}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-xl shrink-0">{agent.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-sm truncate">{agent.name}</span>
                <motion.div 
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    statusColors[agent.status],
                    statusGlow[agent.status]
                  )}
                  animate={agent.status === 'working' ? { 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </div>
              <p className="text-xs text-muted-foreground truncate">{agent.role}</p>
            </div>
            {activeTasks.length > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                {activeTasks.length}
              </Badge>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p className="font-medium">{agent.name}</p>
          <p className="text-xs text-muted-foreground">{statusLabels[agent.status]} · {agentTasks.length} tâches</p>
        </TooltipContent>
      </Tooltip>

      {/* Agent Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <motion.span 
                className="text-4xl"
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                {agent.emoji}
              </motion.span>
              <div>
                <div className="flex items-center gap-2">
                  {agent.name}
                  <div className={cn("w-2.5 h-2.5 rounded-full", statusColors[agent.status], statusGlow[agent.status])} />
                </div>
                <p className="text-sm font-normal text-muted-foreground">{agent.role}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <motion.div 
            className="space-y-4 py-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Status */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Statut
              </label>
              <Select value={agent.status} onValueChange={(v) => handleStatusChange(v as Agent['status'])}>
                <SelectTrigger className="mt-1.5">
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
                {agent.specialties.map((specialty, i) => (
                  <motion.div
                    key={specialty}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Badge variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: agentTasks.length, label: 'Total', color: '' },
                { value: activeTasks.length, label: 'En cours', color: 'text-blue-500' },
                { value: completedTasks.length, label: 'Terminées', color: 'text-green-500' },
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  className="text-center p-3 bg-muted/50 rounded-lg border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Tasks */}
            {agentTasks.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Tâches assignées
                </label>
                <ScrollArea className="h-[140px] mt-1.5">
                  <div className="space-y-1.5 pr-3">
                    {agentTasks.map((task, i) => (
                      <motion.div 
                        key={task.id} 
                        className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg text-sm border border-transparent hover:border-border transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.02 * i }}
                      >
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] px-1.5 shrink-0",
                            task.status === 'done' && 'bg-green-500/10 text-green-500 border-green-500/20',
                            task.status === 'in_progress' && 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          )}
                        >
                          {task.status === 'done' ? '✓' : task.status === 'in_progress' ? '→' : '○'}
                        </Badge>
                        <span className="truncate flex-1">{task.title}</span>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
