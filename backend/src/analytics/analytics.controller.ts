import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AnalyticsDataDto } from './dto/admin-analytics.dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get system analytics overview' })
  @ApiOkResponse({
    description: 'Returns full analytics dashboard data',
    type: AnalyticsDataDto,
  })
  async getStats(): Promise<AnalyticsDataDto> {
    return this.analyticsService.getAnalytics();
  }
}
