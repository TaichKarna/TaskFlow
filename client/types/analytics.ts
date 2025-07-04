export interface ProjectStat {
  id: string;
  name: string;
  assignedUsers: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}

export interface UserProductivity {
  id: string;
  name: string;
  assignedTasks: number;
  completedTasks: number;
  completionRate: number;
}

export interface AnalyticsData {
  totalUsers: number;
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  projectStats: ProjectStat[];
  userProductivity: UserProductivity[];
}
