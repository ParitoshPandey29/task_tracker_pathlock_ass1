export interface TaskItem {
  id: string;
  description: string;
  isCompleted: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';
