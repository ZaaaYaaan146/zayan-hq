'use client';

import { Agent } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AgentCardProps {
  agent: Agent;
  isSelected?: boolean;
  onClick?: () => void;
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

export function AgentCard({ agent, isSelected, onClick }: AgentCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md border-l-4",
        isSelected && "ring-2 ring-primary"
      )}
      style={{ borderLeftColor: agent.color }}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{agent.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{agent.name}</h3>
              <div className={cn("w-2 h-2 rounded-full", statusColors[agent.status])} />
            </div>
            <p className="text-sm text-muted-foreground truncate">{agent.role}</p>
          </div>
        </div>
        
        <div className="mt-3">
          <Badge variant="secondary" className="text-xs">
            {statusLabels[agent.status]}
          </Badge>
        </div>
        
        {agent.currentTask && (
          <div className="mt-2 p-2 bg-muted rounded text-sm">
            <span className="text-muted-foreground">Tâche:</span>{' '}
            <span className="font-medium">{agent.currentTask}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
