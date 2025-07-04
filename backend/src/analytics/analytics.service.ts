import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';
import { TaskStatus } from '../tasks/task.enum';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async getAnalytics() {
    const [
      totalUsers,
      totalProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
    ] = await Promise.all([
      this.userRepo.count(),
      this.projectRepo.count(),
      this.taskRepo.count(),
      this.taskRepo.count({ where: { status: TaskStatus.COMPLETED } }),
      this.taskRepo
        .createQueryBuilder('task')
        .where('task.dueDate < :now AND task.status != :status', {
          now: new Date(),
          status: TaskStatus.COMPLETED,
        })
        .getCount(),
    ]);

    const projectStats = await this.projectRepo
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.members', 'member')
      .leftJoinAndSelect('project.tasks', 'task')
      .getMany();

    const formattedProjectStats = projectStats.map((project) => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter(
        (t) => t.status === TaskStatus.COMPLETED,
      ).length;
      return {
        id: project.id,
        name: project.name,
        assignedUsers: project.members.length,
        totalTasks,
        completedTasks,
        completionRate:
          totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100),
      };
    });

    const users = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.createdTasks', 'task')
      .getMany();

    const userProductivity = users.map((user) => {
      const assignedTasks = user.createdTasks.length;
      const completedTasks = user.createdTasks.filter(
        (t) => t.status === TaskStatus.COMPLETED,
      ).length;
      return {
        id: user.id,
        name: user.name,
        assignedTasks,
        completedTasks,
        completionRate:
          assignedTasks === 0
            ? 0
            : Math.round((completedTasks / assignedTasks) * 100),
      };
    });

    return {
      totalUsers,
      totalProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
      projectStats: formattedProjectStats,
      userProductivity,
    };
  }
}
