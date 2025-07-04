import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { User } from 'src/users/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { TaskStatus } from 'src/tasks/task.enum';
import { Task } from 'src/tasks/task.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  async create(dto: CreateProjectDto, ownerId: string): Promise<Project> {
    const project = this.projectRepo.create({
      ...dto,
      ownerId,
    });

    return await this.projectRepo.save(project);
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepo.findOneByOrFail({ id });
    Object.assign(project, dto);
    return await this.projectRepo.save(project);
  }

  async delete(id: string): Promise<void> {
    await this.projectRepo.delete(id);
  }

  async assignUser(projectId: string, userId: string): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['members'],
    });

    if (!project) throw new NotFoundException('Project not found');

    const user = await this.userRepo.findOneByOrFail({ id: userId });

    const isAlreadyAssigned = project.members.some(
      (member) => member.id === userId,
    );
    if (isAlreadyAssigned) {
      throw new ConflictException('User already assigned to this project');
    }

    project.members.push(user);
    return await this.projectRepo.save(project);
  }

  async getProjectStats() {
    const projects = await this.projectRepo.find({
      relations: ['members', 'tasks'],
    });

    const now = new Date();

    return projects.map((project) => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter(
        (t) => t.status === TaskStatus.COMPLETED,
      ).length;
      const pendingTasks = project.tasks.filter(
        (t) => t.status === TaskStatus.PENDING,
      ).length;
      const overdueTasks = project.tasks.filter(
        (t) =>
          t.status !== TaskStatus.COMPLETED && t.dueDate && t.dueDate < now,
      ).length;

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        assignedUsers: project.members.map((m) => {
          return { id: m.id, name: m.name, email: m.email };
        }),
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
      };
    });
  }

  async getDetailedProject(id: string) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['members', 'tasks', 'tasks.createdBy'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      assignedUsers: project.members.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
      })),
      tasks: project.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        completedAt:
          task.status === TaskStatus.COMPLETED ? task.updatedAt : undefined,
        createdBy: {
          id: task.createdBy.id,
          name: task.createdBy.name,
          email: task.createdBy.email,
        },
      })),
    };
  }

  async getTasksForProject(projectId: string, userId: string): Promise<Task[]> {
    const tasks = await this.taskRepo.find({
      where: {
        project: { id: projectId },
        createdBy: { id: userId },
      },
      relations: ['project'],
      order: { dueDate: 'ASC' },
    });

    return tasks;
  }
}
