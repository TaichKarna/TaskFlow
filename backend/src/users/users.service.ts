import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { RawUserRow, UserDashboardResponse } from './types/user.types';
import { UpdateUserDto } from './dto/update-user.dto';
import { Project } from 'src/projects/project.entity';
import { Task } from 'src/tasks/task.entity';
import { Raw } from 'typeorm';
import { UserRole, UserStatus } from './user.enum';

interface TaskStats {
  total: string;
  completed: string;
  pending: string;
  inProgress: string;
  overdue: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async findAll(query: GetUsersQueryDto) {
    const { page = 1, limit = 10, search } = query;

    const totalUsers = await this.userRepo.count();
    const activeUsers = await this.userRepo.count({
      where: { status: UserStatus.ACTIVE },
    });
    const inactiveUsers = totalUsers - activeUsers;

    const adminUsers = await this.userRepo.count({
      where: { role: UserRole.ADMIN },
    });

    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const usersLastMonth = await this.userRepo.count({
      where: {
        createdAt: Raw(
          () => `"created_at" < :current AND "created_at" >= :lastMonth`,
          {
            current: now,
            lastMonth,
          },
        ),
      },
    });

    const newUsersThisMonth = totalUsers - usersLastMonth;

    const qb = this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.projects', 'project')
      .leftJoin('user.createdTasks', 'task')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.role',
        'user.status',
        'user.createdAt',
        'COUNT(DISTINCT project.id) AS "projectCount"',
        'COUNT(DISTINCT task.id) AS "taskCount"',
      ])
      .groupBy('user.id')
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.where('user.name ILIKE :search OR user.email ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const { entities: users, raw: rawRes } = await qb.getRawAndEntities();
    const raw = rawRes as RawUserRow[];

    return {
      summary: {
        totalUsers,
        newUsersThisMonth,
        activeUsers,
        inactiveUsers,
        activeRate: totalUsers
          ? Math.round((activeUsers / totalUsers) * 100)
          : 0,
        adminUsers,
      },
      data: users.map((user, i) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        projectsCount: parseInt(raw[i].projectCount) || 0,
        tasksCount: parseInt(raw[i].taskCount) || 0,
      })),
      total: users.length,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
    };
  }

  async getAllMinified(search?: string) {
    const qb = this.userRepo
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email'])
      .orderBy('user.name', 'ASC');

    if (search) {
      qb.where('user.name ILIKE :search OR user.email ILIKE :search', {
        search: `%${search}%`,
      });
    }

    return await qb.getMany();
  }
  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findOneByOrFail({ id });
    Object.assign(user, dto);
    return await this.userRepo.save(user);
  }
  async delete(id: string): Promise<void> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['projects', 'createdTasks'],
    });

    if (!user) throw new NotFoundException('User not found');

    for (const project of user.projects) {
      const fullProject = await this.projectRepo.findOne({
        where: { id: project.id },
        relations: ['members'],
      });

      if (fullProject) {
        fullProject.members = fullProject.members.filter(
          (member) => member.id !== id,
        );
        await this.projectRepo.save(fullProject);
      }
    }

    await this.userRepo.delete(id);
  }

  async getUserDashboardSummary(
    userId: string,
  ): Promise<UserDashboardResponse> {
    const now = new Date();

    const projects = await this.projectRepo.find({
      where: {
        members: { id: userId },
      },
      select: ['id', 'name', 'description', 'createdAt'],
    });

    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;
    let inProgressTasks = 0;
    let overdueTasks = 0;

    const projectSummaries = await Promise.all(
      projects.map(async (project) => {
        const taskStats = await this.taskRepo
          .createQueryBuilder('task')
          .select([
            'COUNT(*)::int AS total',
            `COUNT(*) FILTER (WHERE task.status = 'completed')::int AS completed`,
            `COUNT(*) FILTER (WHERE task.status = 'pending')::int AS pending`,
            `COUNT(*) FILTER (WHERE task.status = 'in_progress')::int AS inProgress`,
            `COUNT(*) FILTER (WHERE task.status != 'completed' AND task.dueDate < :now)::int AS overdue`,
          ])
          .where('task.projectId = :projectId', { projectId: project.id })
          .andWhere('task.createdById = :userId', { userId })
          .setParameter('now', now)
          .getRawOne<TaskStats>();

        const {
          total = '0',
          completed = '0',
          pending = '0',
          inProgress = '0',
          overdue = '0',
        } = taskStats ?? {};

        const totalNum = parseInt(total);
        const completedNum = parseInt(completed);
        const pendingNum = parseInt(pending);
        const inProgressNum = parseInt(inProgress);
        const overdueNum = parseInt(overdue);

        totalTasks += totalNum;
        completedTasks += completedNum;
        pendingTasks += pendingNum;
        inProgressTasks += inProgressNum;
        overdueTasks += overdueNum;

        return {
          id: project.id,
          name: project.name,
          description: project.description,
          totalTasks: totalNum,
          completedTasks: completedNum,
          pendingTasks: pendingNum,
          overdueTasks: overdueNum,
        };
      }),
    );

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalProjects: projects.length,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      completionRate,
      projects: projectSummaries,
    };
  }
}
