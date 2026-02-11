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
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Main content - Kanban */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <KanbanBoard />
          </div>
          
          {/* Activity sidebar */}
          <div className="w-72 border-l shrink-0 overflow-hidden">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
