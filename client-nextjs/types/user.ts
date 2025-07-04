export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
}

export interface UserWithCount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  projectsCount: number;
  tasksCount: number;
  createdAt: string;
}

export interface PaginatedUsers {
  data: UserWithCount[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
