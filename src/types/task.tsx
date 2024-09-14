export interface Task {
  id:  any;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'completed' | 'in-progress';
}
