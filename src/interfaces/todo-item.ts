export interface TodoItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ToDoEvent {
  type: string;
  content: TodoItem;
}
