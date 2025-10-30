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

import { VehiclesService } from '../services/vehicles.service';
import { VehicleSyncService } from '../services/vehicle-sync.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { VehicleStatus } from '../entities/vehicle.entity';

@ApiTags('vehicles')
@Controller('vehicles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly syncService: VehicleSyncService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  async findAll() {
    return this.vehiclesService.findAll();
  }

  @Get('online')
  @ApiOperation({ summary: 'Get online vehicles' })
  async getOnline() {
    return this.vehiclesService.getOnlineVehicles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  async findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get vehicle statistics' })
  async getStatistics(@Param('id') id: string) {
    return this.vehiclesService.getStatistics(id);
  }

  @Get(':id/track')
  @ApiOperation({ summary: 'Get vehicle track history' })
  async getTrack(
    @Param('id') id: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    return this.vehiclesService.getTrack(id, fromDate, toDate);
  }

  @Post()
  @ApiOperation({ summary: 'Create vehicle' })
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update vehicle' })
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update vehicle status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: VehicleStatus,
  ) {
    return this.vehiclesService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vehicle' })
  async delete(@Param('id') id: string) {
    return this.vehiclesService.delete(id);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Manually sync vehicles from Wialon' })
  async sync() {
    await this.syncService.manualSync();
    return { message: 'Sync started' };
  }
}
