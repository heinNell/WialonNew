import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Delivery, DeliveryStatus } from '../entities/delivery.entity';
import { TasksService } from './tasks.service';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
    private readonly tasksService: TasksService,
  ) {}

  async create(taskId: string) {
    const task = await this.tasksService.findOne(taskId);

    const trackingNumber = this.generateTrackingNumber();

    const delivery = this.deliveryRepository.create({
      taskId: task.id,
      trackingNumber,
      status: DeliveryStatus.CREATED,
    });

    return this.deliveryRepository.save(delivery);
  }

  async findByTaskId(taskId: string) {
    return this.deliveryRepository.findOne({ where: { taskId } });
  }

  async findByTrackingNumber(trackingNumber: string) {
    const delivery = await this.deliveryRepository.findOne({
      where: { trackingNumber },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    return delivery;
  }

  async updateStatus(id: string, status: DeliveryStatus, metadata?: any) {
    const delivery = await this.deliveryRepository.findOne({
      where: { id },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    delivery.status = status;

    if (status === DeliveryStatus.DELIVERED) {
      delivery.deliveredAt = new Date();
    }

    if (metadata) {
      delivery.metadata = { ...delivery.metadata, ...metadata };
    }

    return this.deliveryRepository.save(delivery);
  }

  async addProofOfDelivery(
    id: string,
    proof: {
      recipientName?: string;
      recipientSignature?: string;
      photos?: string[];
      notes?: string;
    },
  ) {
    const delivery = await this.deliveryRepository.findOne({
      where: { id },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    if (proof.recipientName) {
      delivery.recipientName = proof.recipientName;
    }

    if (proof.recipientSignature) {
      delivery.recipientSignature = proof.recipientSignature;
    }

    if (proof.photos) {
      delivery.photos = proof.photos;
    }

    if (proof.notes) {
      delivery.notes = proof.notes;
    }

    delivery.proofOfDelivery = proof;
    delivery.status = DeliveryStatus.DELIVERED;
    delivery.deliveredAt = new Date();

    return this.deliveryRepository.save(delivery);
  }

  private generateTrackingNumber(): string {
    const prefix = 'TRK';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }
}
