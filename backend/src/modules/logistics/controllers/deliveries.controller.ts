import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { DeliveryService } from '../services/delivery.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DeliveryStatus } from '../entities/delivery.entity';

@ApiTags('logistics/deliveries')
@Controller('logistics/deliveries')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DeliveriesController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('track/:trackingNumber')
  @ApiOperation({ summary: 'Track delivery by tracking number' })
  async track(@Param('trackingNumber') trackingNumber: string) {
    return this.deliveryService.findByTrackingNumber(trackingNumber);
  }

  @Post('task/:taskId')
  @ApiOperation({ summary: 'Create delivery for task' })
  async create(@Param('taskId') taskId: string) {
    return this.deliveryService.create(taskId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update delivery status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: DeliveryStatus; metadata?: any },
  ) {
    return this.deliveryService.updateStatus(id, body.status, body.metadata);
  }

  @Put(':id/proof')
  @ApiOperation({ summary: 'Add proof of delivery' })
  async addProof(
    @Param('id') id: string,
    @Body()
    proof: {
      recipientName?: string;
      recipientSignature?: string;
      photos?: string[];
      notes?: string;
    },
  ) {
    return this.deliveryService.addProofOfDelivery(id, proof);
  }
}
