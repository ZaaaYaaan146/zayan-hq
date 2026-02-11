'use client';

import { useDashboardStore } from '@/lib/store';
import { ActivityLog } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Activity, CheckCircle, XCircle, MessageSquare, Rocket, GitCommit } from 'lucide-react';

const typeIcons = {
  task_started: Activity,
  task_completed: CheckCircle,
  task_failed: XCircle,
  message: MessageSquare,
  deploy: Rocket,
  commit: GitCommit,
};

const typeColors = {
  task_started: 'text-blue-500',
  task_completed: 'text-green-500',
  task_failed: 'text-red-500',
  message: 'text-gray-500',
  deploy: 'text-orange-500',
  commit: 'text-purple-500',
};

interface ActivityItemProps {
  activity: ActivityLog;
}

function ActivityItem({ activity }: ActivityItemProps) {
  const { agents } = useDashboardStore();
  const agent = agents.find(a => a.id === activity.agentId);
  const Icon = typeIcons[activity.type];
  
  return (
    <div className="flex items-start gap-2 py-2 border-b border-border/50 last:border-0">
      <div className={`${typeColors[activity.type]} mt-0.5 shrink-0`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {agent && (
            <span className="font-medium text-xs">
              {agent.emoji} {agent.name}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: false, locale: fr })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
          {activity.message}
        </p>
      </div>
    </div>
  );
}

export function ActivityFeed() {
  const { activities } = useDashboardStore();
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b shrink-0">
        <h3 className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
          <Activity className="w-3.5 h-3.5" />
          Activité récente
        </h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-3">
          {activities.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-xs">
              Aucune activité
            </div>
          ) : (
            activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
