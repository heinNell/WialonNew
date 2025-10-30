import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WialonService } from './wialon.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('wialon')
@Controller('wialon')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WialonController {
  constructor(private readonly wialonService: WialonService) {}

  @Get('session')
  @ApiOperation({ summary: 'Get Wialon session info' })
  async getSession() {
    return {
      sessionId: this.wialonService.getSessionId(),
      isActive: !!this.wialonService.getSessionId(),
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login to Wialon' })
  async login() {
    return this.wialonService.login();
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout from Wialon' })
  async logout() {
    await this.wialonService.logout();
    return { message: 'Logged out successfully' };
  }

  @Get('units')
  @ApiOperation({ summary: 'Get all units from Wialon' })
  async getUnits() {
    return this.wialonService.getUnits();
  }

  @Get('geofences')
  @ApiOperation({ summary: 'Get all geofences from Wialon' })
  async getGeofences() {
    return this.wialonService.getGeofences();
  }
}
