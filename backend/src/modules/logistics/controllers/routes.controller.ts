import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { RoutesService } from '../services/routes.service';
import { CreateRouteDto } from '../dto/create-route.dto';
import { UpdateRouteDto } from '../dto/update-route.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RouteStatus } from '../entities/route.entity';

@ApiTags('logistics/routes')
@Controller('logistics/routes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all routes' })
  async findAll(@Query() filters: any) {
    return this.routesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get route by ID' })
  async findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Get(':id/progress')
  @ApiOperation({ summary: 'Get route progress' })
  async getProgress(@Param('id') id: string) {
    return this.routesService.getRouteProgress(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create route' })
  async create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update route' })
  async update(
    @Param('id') id: string,
    @Body() updateRouteDto: UpdateRouteDto,
  ) {
    return this.routesService.update(id, updateRouteDto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update route status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: RouteStatus,
  ) {
    return this.routesService.updateStatus(id, status);
  }

  @Post(':id/optimize')
  @ApiOperation({ summary: 'Optimize route' })
  async optimize(@Param('id') id: string) {
    return this.routesService.optimizeRoute(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete route' })
  async delete(@Param('id') id: string) {
    return this.routesService.delete(id);
  }
}
