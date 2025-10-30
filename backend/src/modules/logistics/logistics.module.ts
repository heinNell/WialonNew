import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Route } from './entities/route.entity';
import { Delivery } from './entities/delivery.entity';
import { Checkpoint } from './entities/checkpoint.entity';
import { TasksController } from './controllers/tasks.controller';
import { RoutesController } from './controllers/routes.controller';
import { DeliveriesController } from './controllers/deliveries.controller';
import { TasksService } from './services/tasks.service';
import { RoutesService } from './services/routes.service';
import { RouteOptimizerService } from './services/route-optimizer.service';
import { DeliveryService } from './services/delivery.service';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { WialonModule } from '../wialon/wialon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Route, Delivery, Checkpoint]),
    VehiclesModule,
    WialonModule,
  ],
  controllers: [TasksController, RoutesController, DeliveriesController],
  providers: [
    TasksService,
    RoutesService,
    RouteOptimizerService,
    DeliveryService,
  ],
  exports: [TasksService, RoutesService, DeliveryService],
})
export class LogisticsModule {}
