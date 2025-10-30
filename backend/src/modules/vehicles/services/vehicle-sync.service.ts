import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WialonService } from '../../wialon/wialon.service';
import { VehiclesService } from './vehicles.service';

@Injectable()
export class VehicleSyncService {
  private readonly logger = new Logger(VehicleSyncService.name);

  constructor(
    private readonly wialonService: WialonService,
    private readonly vehiclesService: VehiclesService,
  ) {}

  /**
   * Sync vehicles from Wialon every 5 minutes
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncVehicles() {
    this.logger.log('Starting vehicle sync from Wialon...');

    try {
      const wialonUnits = await this.wialonService.getUnits();

      for (const unit of wialonUnits.items || []) {
        await this.syncVehicle(unit);
      }

      this.logger.log(
        `Synced ${wialonUnits.items?.length || 0} vehicles from Wialon`,
      );
    } catch (error) {
      this.logger.error('Failed to sync vehicles', error);
    }
  }

  /**
   * Sync positions every 30 seconds
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async syncPositions() {
    try {
      const wialonUnits = await this.wialonService.getUnits();

      for (const unit of wialonUnits.items || []) {
        if (unit.pos) {
          const vehicle = await this.vehiclesService.findByWialonId(unit.id);

          if (vehicle) {
            await this.vehiclesService.updatePosition(vehicle.id, {
              lat: unit.pos.y,
              lng: unit.pos.x,
              speed: unit.pos.s || 0,
              course: unit.pos.c || 0,
              altitude: unit.pos.z || 0,
              satellites: unit.pos.sc || 0,
              timestamp: unit.pos.t,
              sensors: unit.pos.p || {},
            });
          }
        }
      }
    } catch (error) {
      this.logger.error('Failed to sync positions', error);
    }
  }

  private async syncVehicle(wialonUnit: any) {
    try {
      let vehicle = await this.vehiclesService.findByWialonId(wialonUnit.id);

      const vehicleData = {
        wialonId: wialonUnit.id,
        name: wialonUnit.nm,
        licensePlate: wialonUnit.pflds?.plate_number || null,
        vin: wialonUnit.pflds?.vin || null,
        brand: wialonUnit.pflds?.brand || null,
        model: wialonUnit.pflds?.model || null,
        year: wialonUnit.pflds?.year || null,
        color: wialonUnit.pflds?.color || null,
        metadata: {
          deviceType: wialonUnit.uid,
          phoneNumber: wialonUnit.ph,
          ...wialonUnit.pflds,
        },
      };

      if (vehicle) {
        await this.vehiclesService.update(vehicle.id, vehicleData);
      } else {
        vehicle = await this.vehiclesService.create(vehicleData);
      }

      // Update position if available
      if (wialonUnit.pos) {
        await this.vehiclesService.updatePosition(vehicle.id, {
          lat: wialonUnit.pos.y,
          lng: wialonUnit.pos.x,
          speed: wialonUnit.pos.s || 0,
          course: wialonUnit.pos.c || 0,
          altitude: wialonUnit.pos.z || 0,
          satellites: wialonUnit.pos.sc || 0,
          timestamp: wialonUnit.pos.t,
          sensors: wialonUnit.pos.p || {},
        });
      }
    } catch (error) {
      this.logger.error(
        `Failed to sync vehicle ${wialonUnit.id}`,
        error.message,
      );
    }
  }

  /**
   * Manual sync trigger
   */
  async manualSync() {
    await this.syncVehicles();
    await this.syncPositions();
  }
}
