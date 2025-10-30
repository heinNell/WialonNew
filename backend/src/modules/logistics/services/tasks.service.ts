import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Task, TaskStatus } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(filters?: any) {
    const query = this.taskRepository.createQueryBuilder('task');

    if (filters?.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters?.vehicleId) {
      query.andWhere('task.vehicleId = :vehicleId', {
        vehicleId: filters.vehicleId,
      });
    }

    if (filters?.driverId) {
      query.andWhere('task.driverId = :driverId', {
        driverId: filters.driverId,
      });
    }

    if (filters?.routeId) {
      query.andWhere('task.routeId = :routeId', { routeId: filters.routeId });
    }

    if (filters?.from && filters?.to) {
      query.andWhere('task.scheduledStartTime BETWEEN :from AND :to', {
        from: filters.from,
        to: filters.to,
      });
    }

    return query.orderBy('task.scheduledStartTime', 'ASC').getMany();
  }

  async findOne(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(task);
  }

  async createBulk(createTaskDtos: CreateTaskDto[]) {
    const tasks = createTaskDtos.map((dto) => this.taskRepository.create(dto));
    return this.taskRepository.save(tasks);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async delete(id: string) {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
    return { message: 'Task deleted successfully' };
  }

  async updateStatus(id: string, status: TaskStatus, notes?: string) {
    const task = await this.findOne(id);
    task.status = status;

    if (status === TaskStatus.IN_PROGRESS && !task.actualStartTime) {
      task.actualStartTime = new Date();
    }

    if (status === TaskStatus.COMPLETED) {
      task.actualEndTime = new Date();
      if (notes) {
        task.completionNotes = notes;
      }
    }

    return this.taskRepository.save(task);
  }

  async assignToVehicle(id: string, vehicleId: string, driverId?: string) {
    const task = await this.findOne(id);
    task.vehicleId = vehicleId;
    if (driverId) {
      task.driverId = driverId;
    }
    task.status = TaskStatus.ASSIGNED;
    return this.taskRepository.save(task);
  }

  async assignToRoute(taskIds: string[], routeId: string) {
    const tasks = await this.taskRepository.find({
      where: { id: In(taskIds) },
    });

    tasks.forEach((task) => {
      task.routeId = routeId;
      task.status = TaskStatus.ASSIGNED;
    });

    return this.taskRepository.save(tasks);
  }

  async getTasksByRoute(routeId: string) {
    return this.taskRepository.find({
      where: { routeId },
      order: { scheduledStartTime: 'ASC' },
    });
  }

  async getTaskStatistics(filters?: any) {
    const tasks = await this.findAll(filters);

    const stats = {
      total: tasks.length,
      pending: 0,
      assigned: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      failed: 0,
    };

    tasks.forEach((task) => {
      switch (task.status) {
        case TaskStatus.PENDING:
          stats.pending++;
          break;
        case TaskStatus.ASSIGNED:
          stats.assigned++;
          break;
        case TaskStatus.IN_PROGRESS:
          stats.inProgress++;
          break;
        case TaskStatus.COMPLETED:
          stats.completed++;
          break;
        case TaskStatus.CANCELLED:
          stats.cancelled++;
          break;
        case TaskStatus.FAILED:
          stats.failed++;
          break;
      }
    });

    return stats;
  }
}
