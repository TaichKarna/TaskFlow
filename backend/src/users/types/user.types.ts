export interface RawUserRow {
  projectCount: string;
  taskCount: string;
}

export interface UserDashboardResponse {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRate: number;
  projects: {
    id: string;
    name: string;
    description: string;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
  }[];
}
