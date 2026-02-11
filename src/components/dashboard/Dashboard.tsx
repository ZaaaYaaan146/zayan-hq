'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '@/lib/store';
import { defaultAgents, defaultProjects, sampleTasks, sampleActivities } from '@/lib/data';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { KanbanBoard } from './KanbanBoard';
import { ActivityFeed } from './ActivityFeed';

export function Dashboard() {
  const { setAgents, setTasks, setActivities, setProjects } = useDashboardStore();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Initialize with default data
    setAgents(defaultAgents);
    setProjects(defaultProjects);
    setTasks(sampleTasks);
    setActivities(sampleActivities);
    
    // Trigger load animation
    setTimeout(() => setIsLoaded(true), 100);
  }, [setAgents, setTasks, setActivities, setProjects]);
  
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <AnimatePresence>
        {isLoaded && (
          <>
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Sidebar />
            </motion.div>
            
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
              >
                <Header />
              </motion.div>
              
              <div className="flex-1 flex min-h-0 overflow-hidden">
                <motion.div 
                  className="flex-1 min-w-0 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                >
                  <KanbanBoard />
                </motion.div>
                
                <motion.div 
                  className="w-72 border-l shrink-0 overflow-hidden"
                  initial={{ x: 280, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.15, ease: 'easeOut' }}
                >
                  <ActivityFeed />
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
