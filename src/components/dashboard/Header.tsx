'use client';

import { useDashboardStore } from '@/lib/store';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, RefreshCw, LogOut } from 'lucide-react';

export function Header() {
  const { tasks, agents } = useDashboardStore();
  
  const taskStats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };
  
  const activeAgents = agents.filter(a => a.status === 'working').length;
  
  return (
    <header className="border-b bg-card px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-lg font-semibold">Task Board</h2>
            <p className="text-sm text-muted-foreground">
              {taskStats.total} tâches · {taskStats.inProgress} en cours · {taskStats.done} terminées
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {activeAgents} agent{activeAgents !== 1 ? 's' : ''} actif{activeAgents !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle tâche
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
