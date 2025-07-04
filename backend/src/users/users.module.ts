import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Project } from 'src/projects/project.entity';
import { Task } from 'src/tasks/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Task])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
