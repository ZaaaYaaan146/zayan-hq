'use client';

import { Agent } from '@/types';
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
    <div 
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg border transition-all hover:bg-muted/50 cursor-pointer",
        isSelected && "ring-2 ring-primary"
      )}
      style={{ borderLeftColor: agent.color, borderLeftWidth: '3px' }}
      onClick={onClick}
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
  );
}
