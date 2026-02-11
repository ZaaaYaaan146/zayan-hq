'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '@/lib/store';
import { Task, TaskStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { MoreHorizontal, Trash2, ArrowRight, ArrowLeft, Edit, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const columns: { id: TaskStatus; label: string; color: string; bgColor: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'bg-gray-500', bgColor: 'bg-gray-500/5' },
  { id: 'todo', label: 'À faire', color: 'bg-blue-500', bgColor: 'bg-blue-500/5' },
  { id: 'in_progress', label: 'En cours', color: 'bg-yellow-500', bgColor: 'bg-yellow-500/5' },
  { id: 'review', label: 'Review', color: 'bg-purple-500', bgColor: 'bg-purple-500/5' },
  { id: 'done', label: 'Terminé', color: 'bg-green-500', bgColor: 'bg-green-500/5' },
];

const priorityConfig = {
  low: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', label: 'Basse', icon: '○' },
  medium: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300', label: 'Moyenne', icon: '◐' },
  high: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300', label: 'Haute', icon: '●' },
  urgent: { color: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300', label: 'Urgente', icon: '◉' },
};

interface TaskCardProps {
  task: Task;
  index: number;
}

function TaskCard({ task, index }: TaskCardProps) {
  const { agents, moveTask, deleteTask, updateTask, addActivity } = useDashboardStore();
  const [showEdit, setShowEdit] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    assignedTo: task.assignedTo || '',
  });
  
  const agent = agents.find(a => a.id === task.assignedTo);
  const priority = priorityConfig[task.priority];
  
  const currentIndex = columns.findIndex(c => c.id === task.status);
  const nextColumn = columns[currentIndex + 1];
  const prevColumn = columns[currentIndex - 1];
  
  const handleMove = (direction: 'next' | 'prev') => {
    const targetColumn = direction === 'next' ? nextColumn : prevColumn;
    if (targetColumn) {
      moveTask(task.id, targetColumn.id);
      addActivity({
        id: Date.now().toString(),
        agentId: task.assignedTo || 'zayan',
        type: targetColumn.id === 'done' ? 'task_completed' : 'task_started',
        message: `"${task.title}" → ${targetColumn.label}`,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    addActivity({
      id: Date.now().toString(),
      agentId: 'zayan',
      type: 'message',
      message: `Tâche "${task.title}" supprimée`,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSaveEdit = () => {
    updateTask(task.id, {
      title: editedTask.title,
      description: editedTask.description,
      priority: editedTask.priority,
      assignedTo: editedTask.assignedTo || undefined,
    });
    addActivity({
      id: Date.now().toString(),
      agentId: 'zayan',
      type: 'message',
      message: `Tâche "${editedTask.title}" modifiée`,
      timestamp: new Date().toISOString(),
    });
    setShowEdit(false);
  };
  
  return (
    <TooltipProvider>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
      >
        <Card className="group hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer">
          <CardContent className="p-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-sm leading-tight flex-1 group-hover:text-primary transition-colors">
                {task.title}
              </h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setShowEdit(true)}>
                    <Edit className="w-3.5 h-3.5 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {prevColumn && (
                    <DropdownMenuItem onClick={() => handleMove('prev')}>
                      <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                      ← {prevColumn.label}
                    </DropdownMenuItem>
                  )}
                  {nextColumn && (
                    <DropdownMenuItem onClick={() => handleMove('next')}>
                      <ArrowRight className="w-3.5 h-3.5 mr-2" />
                      → {nextColumn.label}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {task.description && (
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
            
            <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", priority.color)}>
                    {priority.icon} {priority.label}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Priorité {priority.label.toLowerCase()}</TooltipContent>
              </Tooltip>
              {task.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/50">
              {agent ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-default">
                      <span className="text-sm">{agent.emoji}</span>
                      <span className="font-medium">{agent.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{agent.role}</TooltipContent>
                </Tooltip>
              ) : (
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>Non assigné</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: false, locale: fr })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Task Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la tâche</DialogTitle>
          </DialogHeader>
          <motion.div 
            className="space-y-4 py-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Titre</label>
              <Input
                className="mt-1.5"
                placeholder="Titre de la tâche"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
              <Textarea
                className="mt-1.5"
                placeholder="Description (optionnel)"
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Priorité</label>
                <Select
                  value={editedTask.priority}
                  onValueChange={(v) => setEditedTask({ ...editedTask, priority: v as Task['priority'] })}
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
                  value={editedTask.assignedTo}
                  onValueChange={(v) => setEditedTask({ ...editedTask, assignedTo: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Assigné à" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Non assigné</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.emoji} {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit}>
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

interface KanbanColumnProps {
  column: typeof columns[0];
  tasks: Task[];
}

function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  return (
    <div className={cn(
      "flex-1 min-w-[220px] max-w-[280px] flex flex-col h-full rounded-lg p-2",
      column.bgColor
    )}>
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", column.color)} />
        <h3 className="font-semibold text-sm">{column.label}</h3>
        <Badge 
          variant="secondary" 
          className={cn(
            "text-[10px] px-2 py-0.5 ml-auto font-medium",
            tasks.length > 0 && "bg-primary/10 text-primary"
          )}
        >
          {tasks.length}
        </Badge>
      </div>
      
      <ScrollArea className="flex-1 -mx-1 px-1">
        <AnimatePresence mode="popLayout">
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {tasks.length === 0 && (
              <motion.div 
                className="text-center py-8 text-muted-foreground/50 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Aucune tâche
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}

export function KanbanBoard() {
  const { tasks, selectedProject } = useDashboardStore();
  
  const filteredTasks = selectedProject
    ? tasks.filter(t => t.projectId === selectedProject)
    : tasks;
  
  return (
    <div className="flex gap-3 p-3 h-full overflow-x-auto">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          tasks={filteredTasks.filter(t => t.status === column.id)}
        />
      ))}
    </div>
  );
}
