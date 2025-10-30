import { useState } from 'react';
import { TaskItem, FilterType } from '@/types/task';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [tasks, setTasks] = useLocalStorage<TaskItem[]>('tasks', []);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const { toast } = useToast();

  const addTask = () => {
    if (!newTaskDescription.trim()) {
      toast({
        title: "Error",
        description: "Task description cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const newTask: TaskItem = {
      id: crypto.randomUUID(),
      description: newTaskDescription,
      isCompleted: false
    };

    setTasks([...tasks, newTask]);
    setNewTaskDescription('');
    toast({
      title: "Success",
      description: "Task added successfully"
    });
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Success",
      description: "Task deleted successfully"
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Task Manager</h1>
          <p className="text-muted-foreground">Manage your tasks efficiently</p>
        </header>

        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-2 mb-6">
            <Input
              type="text"
              placeholder="Enter task description..."
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={addTask} size="default">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>

          <div className="flex gap-2 mb-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All ({tasks.length})
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              onClick={() => setFilter('active')}
              size="sm"
            >
              Active ({tasks.filter(t => !t.isCompleted).length})
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
              size="sm"
            >
              Completed ({tasks.filter(t => t.isCompleted).length})
            </Button>
          </div>

          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tasks found. Add a new task to get started!
              </div>
            ) : (
              filteredTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-4 bg-background rounded-md border border-border hover:border-primary/50 transition-colors"
                >
                  <Checkbox
                    checked={task.isCompleted}
                    onCheckedChange={() => toggleTask(task.id)}
                    id={task.id}
                  />
                  <label
                    htmlFor={task.id}
                    className={`flex-1 cursor-pointer ${
                      task.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {task.description}
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <footer className="text-center text-sm text-muted-foreground">
          <p>All tasks are saved locally in your browser</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
