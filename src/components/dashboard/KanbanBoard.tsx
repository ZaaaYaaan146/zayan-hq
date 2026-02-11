'use client';

import { useState } from 'react';
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
import { MoreHorizontal, Trash2, ArrowRight, ArrowLeft, Edit, User } from 'lucide-react';
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
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const priorityLabels = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  urgent: 'Urgente',
};

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const { agents, moveTask, deleteTask, updateTask, addActivity } = useDashboardStore();
  const [showEdit, setShowEdit] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    assignedTo: task.assignedTo || '',
  });
  
  const agent = agents.find(a => a.id === task.assignedTo);
  
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
        message: `Tâche "${task.title}" → ${targetColumn.label}`,
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
    <>
      <Card className="hover:shadow-md transition-shadow group">
        <CardContent className="p-2.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm leading-tight flex-1">{task.title}</h4>
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
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEdit(true)}>
                  <Edit className="w-3.5 h-3.5 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {prevColumn && (
                  <DropdownMenuItem onClick={() => handleMove('prev')}>
                    <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                    Vers {prevColumn.label}
                  </DropdownMenuItem>
                )}
                {nextColumn && (
                  <DropdownMenuItem onClick={() => handleMove('next')}>
                    <ArrowRight className="w-3.5 h-3.5 mr-2" />
                    Vers {nextColumn.label}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <Badge className={cn("text-[10px] px-1.5 py-0", priorityColors[task.priority])}>
              {priorityLabels[task.priority]}
            </Badge>
            {task.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
            {agent ? (
              <div className="flex items-center gap-1">
                <span>{agent.emoji}</span>
                <span>{agent.name}</span>
              </div>
            ) : (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                Non assigné
              </span>
            )}
            <span>
              {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: false, locale: fr })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Edit Task Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la tâche</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Titre de la tâche"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            />
            <Textarea
              placeholder="Description (optionnel)"
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={editedTask.priority}
                onValueChange={(v) => setEditedTask({ ...editedTask, priority: v as Task['priority'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={editedTask.assignedTo}
                onValueChange={(v) => setEditedTask({ ...editedTask, assignedTo: v })}
              >
                <SelectTrigger>
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
    </>
  );
}

interface KanbanColumnProps {
  column: typeof columns[0];
  tasks: Task[];
}

function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  return (
    <div className="flex-1 min-w-[200px] max-w-[260px] flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2 px-1 shrink-0">
        <div className={cn("w-2 h-2 rounded-full shrink-0", column.color)} />
        <h3 className="font-semibold text-xs">{column.label}</h3>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-auto">
          {tasks.length}
        </Badge>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-6 text-muted-foreground text-xs">
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
