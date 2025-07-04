import {
  Controller,
  Get,
  Query,
  Put,
  Param,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CurrentUser } from './decorators/curren-user.decorator';
import { User } from './user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'john' })
  getAll(@Query() query: GetUsersQueryDto) {
    return this.service.findAll(query);
  }

  @Get('minified')
  @ApiOperation({ summary: 'Search users by name/email (public)' })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'john' })
  getMinified(@Query('search') search?: string) {
    return this.service.getAllMinified(search);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update user (admin only)' })
  @ApiParam({ name: 'id', type: String })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete user (admin only)' })
  @ApiParam({ name: 'id', type: String })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiTags('Users')
  getUserDashboard(@CurrentUser() user: User) {
    return this.service.getUserDashboardSummary(user.id);
  }
}
