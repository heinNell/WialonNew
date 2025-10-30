import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Route, RouteStatus } from '../entities/route.entity';
import { Checkpoint } from '../entities/checkpoint.entity';
import { CreateRouteDto } from '../dto/create-route.dto';
import { UpdateRouteDto } from '../dto/update-route.dto';
import { TasksService } from './tasks.service';
import { RouteOptimizerService } from './route-optimizer.service';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(Checkpoint)
    private readonly checkpointRepository: Repository<Checkpoint>,
    private readonly tasksService: TasksService,
    private readonly optimizerService: RouteOptimizerService,
  ) {}

  async findAll(filters?: any) {
    const query = this.routeRepository.createQueryBuilder('route');

    if (filters?.status) {
      query.andWhere('route.status = :status', { status: filters.status });
    }

    if (filters?.vehicleId) {
      query.andWhere('route.vehicleId = :vehicleId', {
        vehicleId: filters.vehicleId,
      });
    }

    if (filters?.driverId) {
      query.andWhere('route.driverId = :driverId', {
        driverId: filters.driverId,
      });
    }

    return query
      .leftJoinAndSelect('route.tasks', 'tasks')
      .orderBy('route.scheduledStartTime', 'ASC')
      .getMany();
  }

  async findOne(id: string) {
    const route = await this.routeRepository.findOne({
      where: { id },
      relations: ['tasks', 'checkpoints'],
    });

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    return route;
  }

  async create(createRouteDto: CreateRouteDto) {
    const route = this.routeRepository.create(createRouteDto);
    const savedRoute = await this.routeRepository.save(route);

    // Assign tasks to route
    if (createRouteDto.taskIds && createRouteDto.taskIds.length > 0) {
      await this.tasksService.assignToRoute(
        createRouteDto.taskIds,
        savedRoute.id,
      );
    }

    return this.findOne(savedRoute.id);
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    const route = await this.findOne(id);
    Object.assign(route, updateRouteDto);
    return this.routeRepository.save(route);
  }

  async delete(id: string) {
    const route = await this.findOne(id);
    await this.routeRepository.remove(route);
    return { message: 'Route deleted successfully' };
  }

  async updateStatus(id: string, status: RouteStatus) {
    const route = await this.findOne(id);
    route.status = status;

    if (status === RouteStatus.ACTIVE && !route.actualStartTime) {
      route.actualStartTime = new Date();
    }

    if (status === RouteStatus.COMPLETED) {
      route.actualEndTime = new Date();
      if (route.actualStartTime) {
        const duration =
          (route.actualEndTime.getTime() - route.actualStartTime.getTime()) /
          60000;
        route.actualDuration = Math.round(duration);
      }
    }

    return this.routeRepository.save(route);
  }

  async optimizeRoute(id: string) {
    const route = await this.findOne(id);
    const tasks = route.tasks || [];

    if (tasks.length === 0) {
      throw new Error('No tasks to optimize');
    }

    // Convert tasks to checkpoints
    const checkpoints = tasks.map((task) => ({
      id: task.id,
      lat: task.latitude,
      lng: task.longitude,
      address: task.address,
      priority: task.priority,
      scheduledTime: task.scheduledStartTime,
      duration: task.estimatedDuration,
    }));

    // Optimize
    const optimized = await this.optimizerService.optimizeRoute(checkpoints, {
      lat: route.startLatitude,
      lng: route.startLongitude,
    });

    // Update route
    route.totalDistance = optimized.totalDistance;
    route.estimatedDuration = optimized.estimatedDuration;
    route.isOptimized = true;
    route.optimizationParams = optimized.params;

    await this.routeRepository.save(route);

    // Create checkpoints
    await this.checkpointRepository.delete({ routeId: route.id });

    const newCheckpoints = optimized.sequence.map((point, index) => {
      return this.checkpointRepository.create({
        routeId: route.id,
        taskId: point.id,
        sequence: index + 1,
        latitude: point.lat,
        longitude: point.lng,
        address: point.address,
        estimatedArrival: point.estimatedArrival,
      });
    });

    await this.checkpointRepository.save(newCheckpoints);

    return this.findOne(route.id);
  }

  async addCheckpoint(routeId: string, checkpointData: Partial<Checkpoint>) {
    const route = await this.findOne(routeId);

    const checkpoint = this.checkpointRepository.create({
      routeId: route.id,
      ...checkpointData,
    });

    return this.checkpointRepository.save(checkpoint);
  }

  async updateCheckpointStatus(
    checkpointId: string,
    isCompleted: boolean,
    actualArrival?: Date,
  ) {
    const checkpoint = await this.checkpointRepository.findOne({
      where: { id: checkpointId },
    });

    if (!checkpoint) {
      throw new NotFoundException('Checkpoint not found');
    }

    checkpoint.isCompleted = isCompleted;
    if (actualArrival) {
      checkpoint.actualArrival = actualArrival;
    }

    return this.checkpointRepository.save(checkpoint);
  }

  async getRouteProgress(id: string) {
    const route = await this.findOne(id);
    const checkpoints = await this.checkpointRepository.find({
      where: { routeId: id },
      order: { sequence: 'ASC' },
    });

    const completed = checkpoints.filter((cp) => cp.isCompleted).length;
    const total = checkpoints.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return {
      route,
      checkpoints,
      progress: {
        completed,
        total,
        percentage: Math.round(percentage),
      },
    };
  }
}
