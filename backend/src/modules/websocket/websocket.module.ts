import { Module } from '@nestjs/common';
import { WebSocketGateway } from './websocket.gateway';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { LogisticsModule } from '../logistics/logistics.module';

@Module({
  imports: [VehiclesModule, LogisticsModule],
  providers: [WebSocketGateway],
  exports: [WebSocketGateway],
})
export class WebSocketModule {}
