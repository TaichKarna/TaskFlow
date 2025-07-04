import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Project } from 'src/projects/project.entity';
import { Task } from 'src/tasks/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Task])],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
