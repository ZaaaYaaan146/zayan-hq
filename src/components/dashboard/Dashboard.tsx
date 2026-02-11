'use client';

import { useEffect } from 'react';
import { useDashboardStore } from '@/lib/store';
import { defaultAgents, defaultProjects, sampleTasks, sampleActivities } from '@/lib/data';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { KanbanBoard } from './KanbanBoard';
import { ActivityFeed } from './ActivityFeed';

export function Dashboard() {
  const { setAgents, setTasks, setActivities, setProjects } = useDashboardStore();
  
  useEffect(() => {
    // Initialize with default data
    setAgents(defaultAgents);
    setProjects(defaultProjects);
    setTasks(sampleTasks);
    setActivities(sampleActivities);
  }, [setAgents, setTasks, setActivities, setProjects]);
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <div className="flex-1 flex min-h-0">
          {/* Main content - Kanban */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <KanbanBoard />
          </div>
          
          {/* Activity sidebar */}
          <div className="w-80 border-l p-4">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
