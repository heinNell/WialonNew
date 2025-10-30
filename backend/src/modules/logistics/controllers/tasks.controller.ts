import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskStatus } from '../entities/task.entity';
import { TasksService } from '../services/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('vehicleId') vehicleId?: string,
    @Query('driverId') driverId?: string,
    @Query('routeId') routeId?: string,
  ) {
    return this.tasksService.findAll({
      status,
      priority,
      vehicleId,
      driverId,
      routeId,
    });
  }

  @Get('statistics')
  async getStatistics(@Query() filters: any) {
    return this.tasksService.getTaskStatistics(filters);
  }

  @Get('route/:routeId')
  async getTasksByRoute(@Param('routeId') routeId: string) {
    return this.tasksService.getTasksByRoute(routeId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Post('bulk')
  async createBulk(@Body() createTaskDtos: CreateTaskDto[]) {
    return this.tasksService.createBulk(createTaskDtos);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
    @Body('notes') notes?: string,
  ) {
    return this.tasksService.updateStatus(id, status, notes);
  }

  @Put(':id/assign-vehicle')
  async assignToVehicle(
    @Param('id') id: string,
    @Body('vehicleId') vehicleId: string,
    @Body('driverId') driverId?: string,
  ) {
    return this.tasksService.assignToVehicle(id, vehicleId, driverId);
  }

  @Put('assign-route')
  async assignToRoute(
    @Body('taskIds') taskIds: string[],
    @Body('routeId') routeId: string,
  ) {
    return this.tasksService.assignToRoute(taskIds, routeId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
