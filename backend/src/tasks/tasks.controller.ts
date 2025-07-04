import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Get,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../users/decorators/curren-user.decorator';
import { User } from '../users/user.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Task } from './task.entity';
import { TaskSummaryDto } from './dto/task-summary.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: Task,
  })
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: User) {
    return this.service.create(dto, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: Task,
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.delete(id, user);
  }

  @Get('my-tasks')
  @ApiOperation({ summary: 'Get all tasks created by the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of user-created tasks',
    type: TaskSummaryDto,
    isArray: true,
  })
  async getMyTasks(@CurrentUser() user: User): Promise<TaskSummaryDto[]> {
    return this.service.getTasksCreatedByUser(user.id);
  }
}
