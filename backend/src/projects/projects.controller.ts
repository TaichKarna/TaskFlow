import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Get,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Project } from './project.entity';
import { CurrentUser } from 'src/users/decorators/curren-user.decorator';
import { User } from 'src/users/user.entity';
import { ProjectStatsDto } from './dto/project-stats.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ status: 201, description: 'Project created', type: Project })
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: User) {
    return this.service.create(dto, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ status: 200, description: 'Project updated', type: Project })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Project deleted' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Patch(':id/assign/:userId')
  @ApiOperation({ summary: 'Assign a user to a project' })
  @ApiParam({ name: 'id', type: String, description: 'Project ID' })
  @ApiParam({ name: 'userId', type: String, description: 'User ID to assign' })
  @ApiResponse({
    status: 200,
    description: 'User assigned to project',
    type: Project,
  })
  assignUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.service.assignUser(id, userId);
  }

  @Get('stats')
  @ApiResponse({ type: [ProjectStatsDto] })
  getProjectStats() {
    return this.service.getProjectStats();
  }

  @Get(':id/detailed')
  @Roles('admin')
  @ApiParam({ name: 'id', type: 'string', description: 'Project ID' })
  async getDetailed(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getDetailedProject(id);
  }
  @Get(':id/tasks')
  @UseGuards(JwtAuthGuard)
  @Roles('user')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get tasks for a project created by the current user',
  })
  getTasksForProject(
    @Param('id') projectId: string,
    @CurrentUser() user: User,
  ) {
    return this.service.getTasksForProject(projectId, user.id);
  }
}
