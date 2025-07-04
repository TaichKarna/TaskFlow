import api from '@/api';
import { MyTask, ProjectTask } from '@/types/task';

export const fetchMyTasks = async (): Promise<MyTask[]> => {
  const response = await api.get<MyTask[]>('/tasks/my-tasks');
  return response;
};

import { CreateTaskDto } from '@/types/task';

export const createTask = async (data: CreateTaskDto): Promise<ProjectTask> => {
  return await api.post('/tasks', data);
};

import { UpdateTaskDto } from '@/types/task';

export const updateTask = async (
  id: string,
  data: Partial<UpdateTaskDto>
): Promise<void> => {
  await api.patch(`/tasks/${id}`, data);
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
