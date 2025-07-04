import { Project } from './project';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface MyTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  projectId: string;
  projectName: string;
  priority: TaskPriority;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId: string;
  project: Project;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  projectId: string;
}

export interface UpdateTaskDto {
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}
