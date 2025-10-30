import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { Vehicle } from './entities/vehicle.entity';
import { VehiclePosition } from './entities/vehicle-position.entity';
import { VehiclesController } from './controllers/vehicles.controller';
import { VehiclesService } from './services/vehicles.service';
import { VehicleSyncService } from './services/vehicle-sync.service';
import { WialonModule } from '../wialon/wialon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, VehiclePosition]),
    ScheduleModule.forRoot(),
    WialonModule,
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService, VehicleSyncService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
