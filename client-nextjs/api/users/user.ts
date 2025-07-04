import api from '@/api';
import type { PaginatedUsers } from '@/types/user';

export const getUsersWithCount = (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return api.get<PaginatedUsers>('/users', { params });
};
