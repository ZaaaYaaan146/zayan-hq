'use client';

import { useDashboardStore } from '@/lib/store';
import { ActivityLog } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="flex items-start gap-3 py-2">
      <div className={typeColors[activity.type]}>
        <Icon className="w-4 h-4 mt-0.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {agent && (
            <span className="font-medium text-sm">
              {agent.emoji} {agent.name}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: fr })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {activity.message}
        </p>
      </div>
    </div>
  );
}

export function ActivityFeed() {
  const { activities } = useDashboardStore();
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Activité récente
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full px-4 pb-4">
          <div className="divide-y">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Aucune activité
              </div>
            ) : (
              activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
