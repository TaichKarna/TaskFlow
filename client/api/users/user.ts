import api from '@/api';
import type { PaginatedUsers } from '@/types/user';
import { DashboardResponse } from '@/types/dashboard';

export const getUsersWithCount = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return await api.get<PaginatedUsers>('/users', { params });
};

export const fetchDashboardData = async (): Promise<DashboardResponse> => {
  const response = await api.get<DashboardResponse>('/users/dashboard');
  return response;
};

export const deleteUser = async (userId: string) => {
  return await api.delete(`/users/${userId}`);
};
