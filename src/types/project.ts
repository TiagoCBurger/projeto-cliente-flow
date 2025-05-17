export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface Comment {
  id: string;
  author: string;
  date: string;
  text: string;
}

export interface Checkpoint {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "pending";
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  subtasks: Subtask[];
  comments: Comment[];
}

export interface Project {
  id: string;
  title: string;
  client: string;
  progress: number;
  checkpoints: Checkpoint[];
  startDate: string;
  endDate: string;
  budget: string;
  daysRemaining: number;
}

export interface ProjectSettingsOptions {
  teamId: string;
  spaceId: string;
  listId: string;
  refreshInterval: number; // em minutos
}

export type ProjectSettingsKey = keyof ProjectSettingsOptions; 