import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './project.entity';
import { User } from '../users/user.entity';
import { Task } from 'src/tasks/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User, Task])],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
