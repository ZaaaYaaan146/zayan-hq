'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '@/lib/store';
import { ActivityLog } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Activity, CheckCircle, XCircle, MessageSquare, Rocket, GitCommit, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeConfig = {
  task_started: { 
    icon: Activity, 
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    label: 'Démarré'
  },
  task_completed: { 
    icon: CheckCircle, 
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    label: 'Terminé'
  },
  task_failed: { 
    icon: XCircle, 
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    label: 'Échec'
  },
  message: { 
    icon: MessageSquare, 
    color: 'text-gray-500',
    bg: 'bg-gray-500/10',
    label: 'Message'
  },
  deploy: { 
    icon: Rocket, 
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    label: 'Déploiement'
  },
  commit: { 
    icon: GitCommit, 
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    label: 'Commit'
  },
};

interface ActivityItemProps {
  activity: ActivityLog;
  index: number;
}

function ActivityItem({ activity, index }: ActivityItemProps) {
  const { agents } = useDashboardStore();
  const agent = agents.find(a => a.id === activity.agentId);
  const config = typeConfig[activity.type];
  const Icon = config.icon;
  
  return (
    <motion.div 
      className="flex items-start gap-2.5 py-2.5 border-b border-border/30 last:border-0 group hover:bg-muted/30 -mx-3 px-3 rounded transition-colors"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
    >
      <div className={cn(
        "mt-0.5 shrink-0 p-1.5 rounded-full",
        config.bg
      )}>
        <Icon className={cn("w-3 h-3", config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {agent && (
            <span className="font-medium text-xs flex items-center gap-1">
              <span className="text-sm">{agent.emoji}</span>
              {agent.name}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground ml-auto shrink-0">
            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: false, locale: fr })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {activity.message}
        </p>
      </div>
    </motion.div>
  );
}

export function ActivityFeed() {
  const { activities } = useDashboardStore();
  
  return (
    <div className="h-full flex flex-col bg-muted/20">
      <div className="p-3 border-b shrink-0 bg-card">
        <h3 className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          Activité récente
        </h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-3 py-1">
          <AnimatePresence mode="popLayout">
            {activities.length === 0 ? (
              <motion.div 
                className="text-center py-8 text-muted-foreground/50 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Aucune activité
              </motion.div>
            ) : (
              activities.map((activity, index) => (
                <ActivityItem key={activity.id} activity={activity} index={index} />
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
