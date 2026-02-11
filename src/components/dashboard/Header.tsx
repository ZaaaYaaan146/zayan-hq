'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '@/lib/store';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Plus, MessageSquare, RefreshCw, LogOut, Send, Zap, CheckCircle2 } from 'lucide-react';
import { Task } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function Header() {
  const { tasks, agents, addTask, addActivity, projects, activities } = useDashboardStore();
  const [showNewTask, setShowNewTask] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [justCreated, setJustCreated] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    assignedTo: '',
    projectId: '',
  });
  
  const taskStats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };
  
  const activeAgents = agents.filter(a => a.status === 'working').length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      addActivity({
        id: Date.now().toString(),
        agentId: 'zayan',
        type: 'message',
        message: 'Dashboard actualisé ✨',
        timestamp: new Date().toISOString(),
      });
      setIsRefreshing(false);
    }, 600);
  };

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    
    addActivity({
      id: Date.now().toString(),
      agentId: 'zayan',
      type: 'message',
      message: `💬 "${chatMessage}"`,
      timestamp: new Date().toISOString(),
    });
    
    setTimeout(() => {
      const responses = [
        "Je prends note ! Je m'en occupe 🦦",
        "Bien reçu ! C'est noté 📝",
        "OK, je vais regarder ça 👀",
        "Message reçu ! Je suis dessus 💪",
      ];
      addActivity({
        id: (Date.now() + 1).toString(),
        agentId: 'zayan',
        type: 'message',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
      });
    }, 800);
    
    setChatMessage('');
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'backlog',
      priority: newTask.priority,
      assignedTo: newTask.assignedTo || undefined,
      projectId: newTask.projectId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    };
    
    addTask(task);
    addActivity({
      id: Date.now().toString(),
      agentId: 'zayan',
      type: 'task_started',
      message: `Nouvelle tâche: "${task.title}"`,
      timestamp: new Date().toISOString(),
    });
    
    setJustCreated(true);
    setTimeout(() => setJustCreated(false), 2000);
    
    setNewTask({ title: '', description: '', priority: 'medium', assignedTo: '', projectId: '' });
    setShowNewTask(false);
  };
  
  return (
    <TooltipProvider>
      <header className="border-b bg-card/80 backdrop-blur-sm px-4 py-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-base font-semibold flex items-center gap-2">
                Task Board
                <AnimatePresence>
                  {justCreated && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </h2>
              <p className="text-xs text-muted-foreground">
                {taskStats.total} tâches · {taskStats.inProgress} en cours · {taskStats.done} terminées
              </p>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "gap-1.5 text-xs cursor-default transition-colors",
                    activeAgents > 0 && "border-green-500/30 bg-green-500/5"
                  )}
                >
                  <motion.span 
                    className="w-1.5 h-1.5 rounded-full bg-green-500"
                    animate={activeAgents > 0 ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  {activeAgents} actif{activeAgents !== 1 ? 's' : ''}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {activeAgents > 0 
                  ? `${activeAgents} agent${activeAgents > 1 ? 's' : ''} travaille${activeAgents > 1 ? 'nt' : ''} actuellement`
                  : 'Tous les agents sont disponibles'
                }
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs gap-1.5"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")} />
                  <span className="hidden sm:inline">Actualiser</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Actualiser les données</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs gap-1.5"
                  onClick={() => setShowChat(true)}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chat</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Discuter avec Zayan</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  className="h-8 text-xs gap-1.5" 
                  onClick={() => setShowNewTask(true)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Nouvelle tâche</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Créer une nouvelle tâche</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Déconnexion</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      {/* New Task Dialog */}
      <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Nouvelle tâche
            </DialogTitle>
          </DialogHeader>
          <motion.div 
            className="space-y-4 py-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Titre *</label>
              <Input
                className="mt-1.5"
                placeholder="Ex: Implémenter la feature X"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
              <Textarea
                className="mt-1.5"
                placeholder="Détails de la tâche (optionnel)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Priorité</label>
                <Select
                  value={newTask.priority}
                  onValueChange={(v) => setNewTask({ ...newTask, priority: v as Task['priority'] })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">○ Basse</SelectItem>
                    <SelectItem value="medium">◐ Moyenne</SelectItem>
                    <SelectItem value="high">● Haute</SelectItem>
                    <SelectItem value="urgent">◉ Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Assigné à</label>
                <Select
                  value={newTask.assignedTo}
                  onValueChange={(v) => setNewTask({ ...newTask, assignedTo: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Choisir..." />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.emoji} {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {projects.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Projet</label>
                <Select
                  value={newTask.projectId}
                  onValueChange={(v) => setNewTask({ ...newTask, projectId: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Choisir un projet..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2.5 h-2.5 rounded" 
                            style={{ backgroundColor: project.color }}
                          />
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </motion.div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTask(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateTask} disabled={!newTask.title.trim()}>
              <Plus className="w-4 h-4 mr-1.5" />
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <motion.span
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.3 }}
              >
                🦦
              </motion.span>
              Chat avec Zayan
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-[350px]">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {activities.filter(a => a.type === 'message').slice(0, 15).map((activity, index) => {
                    const agent = agents.find(a => a.id === activity.agentId);
                    return (
                      <motion.div 
                        key={activity.id} 
                        className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <span className="text-lg shrink-0">{agent?.emoji || '💬'}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{agent?.name || 'Système'}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{activity.message}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </ScrollArea>
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Input
                placeholder="Envoyer un message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                className="flex-1"
              />
              <Button size="sm" onClick={handleSendChat} disabled={!chatMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
