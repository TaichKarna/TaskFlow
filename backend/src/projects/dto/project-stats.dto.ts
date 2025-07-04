import { ApiProperty } from '@nestjs/swagger';

export class ProjectStatsDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [String] })
  assignedUsers: string[];

  @ApiProperty()
  totalTasks: number;

  @ApiProperty()
  completedTasks: number;

  @ApiProperty()
  pendingTasks: number;

  @ApiProperty()
  overdueTasks: number;
}
