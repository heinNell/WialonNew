import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { WialonService } from './wialon.service';
import { WialonController } from './wialon.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [WialonController],
  providers: [WialonService],
  exports: [WialonService],
})
export class WialonModule {}
