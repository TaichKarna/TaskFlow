import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../task.enum';

export class TaskSummaryDto {
  @ApiProperty({ example: 'a1b2c3d4-5678-90ef-gh12-ijkl34567890' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Fix login issue' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'User is unable to log in with correct credentials.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'in-progress', 'completed'],
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({ example: 'medium', enum: ['low', 'medium', 'high'] })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({ example: '2025-07-05T23:59:59.000Z' })
  @IsString()
  dueDate: string;

  @ApiProperty({ example: 'a1b2c3d4-5678-90ef-gh12-ijkl34567890' })
  @IsString()
  projectId: string;

  @ApiProperty({ example: 'Website Redesign' })
  @IsString()
  projectName: string;
}
