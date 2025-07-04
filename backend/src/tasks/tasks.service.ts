import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Project } from '../projects/project.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user.enum';
import { TaskSummaryDto } from './dto/task-summary.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  async create(dto: CreateTaskDto, user: User): Promise<Task> {
    const project = await this.projectRepo.findOneByOrFail({
      id: dto.projectId,
    });

    const task = this.taskRepo.create({
      ...dto,
      project,
      createdBy: user,
      createdById: user.id,
    });

    return await this.taskRepo.save(task);
  }

  async update(id: string, dto: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.taskRepo.findOneByOrFail({ id });

    if (task.createdById !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You are not allowed to update this task');
    }

    Object.assign(task, dto);
    return await this.taskRepo.save(task);
  }

  async delete(id: string, user: User): Promise<void> {
    const task = await this.taskRepo.findOneByOrFail({ id });

    if (task.createdById !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You are not allowed to delete this task');
    }

    await this.taskRepo.remove(task);
  }

  async getTasksCreatedByUser(userId: string): Promise<TaskSummaryDto[]> {
    const tasks = await this.taskRepo
      .createQueryBuilder('task')
      .leftJoin('task.project', 'project')
      .select([
        'task.id',
        'task.title',
        'task.description',
        'task.status',
        'task.dueDate',
        'task.projectId',
        'project.name',
        'task.priority',
      ])
      .where('task.createdById = :userId', { userId })
      .orderBy('task.dueDate', 'ASC')
      .getMany();

    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      dueDate: t.dueDate.toISOString(),
      projectId: t.projectId,
      priority: t.priority,
      projectName: t.project?.name ?? '',
    }));
  }
}
