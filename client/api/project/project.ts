import api from '@/api';
import { ProjectTask } from '@/types/task';

export const fetchProjectTasksByCurrentUser = async (
  projectId: string
): Promise<ProjectTask[]> => {
  const response = await api.get<ProjectTask[]>(`/projects/${projectId}/tasks`);
  return response;
};

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface CreateProjectResponse {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export const createProject = async (
  data: CreateProjectRequest
): Promise<CreateProjectResponse> => {
  const response = await api.post<CreateProjectResponse>('/projects', data);
  return response;
};

export interface ProjectWithStats {
  id: string;
  name: string;
  description: string;
  assignedUsers: {
    id: string;
    name: string;
    email: string;
  }[];
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

export const fetchProjectStats = async (): Promise<ProjectWithStats[]> => {
  const response = await api.get<ProjectWithStats[]>('/projects/stats');
  return response;
};

export const updateProject = async (
  id: string,
  data: Pick<ProjectWithStats, 'name' | 'description'>
): Promise<ProjectWithStats> => {
  const response = await api.patch<ProjectWithStats>(`/projects/${id}`, data);
  return response;
};
