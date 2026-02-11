'use client';

import { useDashboardStore } from '@/lib/store';
import { Task, TaskStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'bg-gray-500' },
  { id: 'todo', label: 'À faire', color: 'bg-blue-500' },
  { id: 'in_progress', label: 'En cours', color: 'bg-yellow-500' },
  { id: 'review', label: 'Review', color: 'bg-purple-500' },
  { id: 'done', label: 'Terminé', color: 'bg-green-500' },
];

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

interface TaskCardProps {
  task: Task;
  onMove: (status: TaskStatus) => void;
}

function TaskCard({ task, onMove }: TaskCardProps) {
  const { agents } = useDashboardStore();
  const agent = agents.find(a => a.id === task.assignedTo);
  
  return (
    <Card className="cursor-move hover:shadow-md transition-shadow group">
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{task.title}</h4>
            {task.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge className={cn("text-xs", priorityColors[task.priority])}>
                {task.priority}
              </Badge>
              {task.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              {agent && (
                <div className="flex items-center gap-1">
                  <span>{agent.emoji}</span>
                  <span>{agent.name}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true, locale: fr })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface KanbanColumnProps {
  column: typeof columns[0];
  tasks: Task[];
  onAddTask?: () => void;
}

function KanbanColumn({ column, tasks, onAddTask }: KanbanColumnProps) {
  const { moveTask } = useDashboardStore();
  
  return (
    <div className="flex-1 min-w-[280px] max-w-[320px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", column.color)} />
          <h3 className="font-semibold text-sm">{column.label}</h3>
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </div>
        {column.id === 'backlog' && (
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={onAddTask}>
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="space-y-2 pr-2">
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task}
              onMove={(status) => moveTask(task.id, status)}
            />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Aucune tâche
            </div>
          )}
        </div>
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
    <div className="flex gap-4 p-4 overflow-x-auto">
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
