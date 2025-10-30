import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

import { Vehicle, VehicleStatus } from '../entities/vehicle.entity';
import { VehiclePosition } from '../entities/vehicle-position.entity';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(VehiclePosition)
    private readonly positionRepository: Repository<VehiclePosition>,
  ) {}

  async findAll() {
    return this.vehicleRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async findByWialonId(wialonId: number) {
    return this.vehicleRepository.findOne({ where: { wialonId } });
  }

  async create(createVehicleDto: CreateVehicleDto) {
    const vehicle = this.vehicleRepository.create(createVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);
    Object.assign(vehicle, updateVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }

  async delete(id: string) {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
    return { message: 'Vehicle deleted successfully' };
  }

  async updatePosition(vehicleId: string, positionData: any) {
    const vehicle = await this.findOne(vehicleId);

    // Update current position in vehicle
    vehicle.currentLat = positionData.lat;
    vehicle.currentLng = positionData.lng;
    vehicle.currentSpeed = positionData.speed;
    vehicle.currentCourse = positionData.course;
    vehicle.isOnline = true;
    vehicle.lastMessageTime = new Date(positionData.timestamp * 1000);

    await this.vehicleRepository.save(vehicle);

    // Save position history
    const position = this.positionRepository.create({
      vehicleId: vehicle.id,
      lat: positionData.lat,
      lng: positionData.lng,
      speed: positionData.speed,
      course: positionData.course,
      altitude: positionData.altitude || 0,
      satellites: positionData.satellites || 0,
      timestamp: new Date(positionData.timestamp * 1000),
      sensors: positionData.sensors || {},
    });

    await this.positionRepository.save(position);

    return vehicle;
  }

  async getTrack(vehicleId: string, from: Date, to: Date) {
    const positions = await this.positionRepository.find({
      where: {
        vehicleId,
        timestamp: Between(from, to),
      },
      order: {
        timestamp: 'ASC',
      },
    });

    return positions;
  }

  async getStatistics(vehicleId: string) {
    const vehicle = await this.findOne(vehicleId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const positions = await this.positionRepository.find({
      where: {
        vehicleId,
        timestamp: Between(today, new Date()),
      },
      order: {
        timestamp: 'ASC',
      },
    });

    let totalDistance = 0;
    let maxSpeed = 0;
    let totalTime = 0;

    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];

      // Calculate distance using Haversine formula
      const distance = this.calculateDistance(
        prev.lat,
        prev.lng,
        curr.lat,
        curr.lng,
      );

      totalDistance += distance;

      if (curr.speed > maxSpeed) {
        maxSpeed = curr.speed;
      }

      const timeDiff =
        (curr.timestamp.getTime() - prev.timestamp.getTime()) / 1000;
      totalTime += timeDiff;
    }

    const avgSpeed = totalTime > 0 ? totalDistance / (totalTime / 3600) : 0;

    return {
      vehicle,
      today: {
        distance: Math.round(totalDistance * 100) / 100,
        maxSpeed: Math.round(maxSpeed * 100) / 100,
        avgSpeed: Math.round(avgSpeed * 100) / 100,
        duration: Math.round(totalTime / 60), // minutes
        pointsCount: positions.length,
      },
    };
  }

  async getOnlineVehicles() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    return this.vehicleRepository
      .createQueryBuilder('vehicle')
      .where('vehicle.lastMessageTime > :time', { time: fiveMinutesAgo })
      .getMany();
  }

  async updateStatus(vehicleId: string, status: VehicleStatus) {
    const vehicle = await this.findOne(vehicleId);
    vehicle.status = status;
    return this.vehicleRepository.save(vehicle);
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
