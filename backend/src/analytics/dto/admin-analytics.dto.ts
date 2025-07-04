import { ApiProperty } from '@nestjs/swagger';

export class ProjectStatsDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  assignedUsers: number;

  @ApiProperty()
  totalTasks: number;

  @ApiProperty()
  completedTasks: number;

  @ApiProperty()
  completionRate: number;
}

export class UserProductivityDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  assignedTasks: number;

  @ApiProperty()
  completedTasks: number;

  @ApiProperty()
  completionRate: number;
}

export class AnalyticsDataDto {
  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  totalProjects: number;

  @ApiProperty()
  totalTasks: number;

  @ApiProperty()
  completedTasks: number;

  @ApiProperty()
  overdueTasks: number;

  @ApiProperty({ type: [ProjectStatsDto] })
  projectStats: ProjectStatsDto[];

  @ApiProperty({ type: [UserProductivityDto] })
  userProductivity: UserProductivityDto[];
}
