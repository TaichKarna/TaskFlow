import { IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'mandeep' })
  @IsString()
  @IsOptional()
  search?: string;
}
