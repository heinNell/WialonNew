import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface WialonSession {
  eid: string;
  user: any;
  base_url: string;
}

@Injectable()
export class WialonService {
  private readonly logger = new Logger(WialonService.name);
  private sessionId: string;
  private readonly apiUrl: string;
  private readonly token: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiUrl = this.configService.get('WIALON_API_URL');
    this.token = this.configService.get('WIALON_TOKEN');
  }

  /**
   * Login to Wialon using token
   */
  async login(): Promise<WialonSession> {
    try {
      const response = await this.callAPI('token/login', {
        token: this.token,
      });

      this.sessionId = response.eid;
      this.logger.log(`Logged in to Wialon. Session: ${this.sessionId}`);

      return response;
    } catch (error) {
      this.logger.error('Failed to login to Wialon', error);
      throw new HttpException(
        'Failed to authenticate with Wialon',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Logout from Wialon
   */
  async logout(): Promise<void> {
    if (!this.sessionId) {
      return;
    }

    try {
      await this.callAPI('core/logout', {}, true);
      this.logger.log('Logged out from Wialon');
      this.sessionId = null;
    } catch (error) {
      this.logger.error('Failed to logout from Wialon', error);
    }
  }

  /**
   * Get all units (vehicles)
   */
  async getUnits() {
    await this.ensureSession();

    return this.callAPI(
      'core/search_items',
      {
        spec: {
          itemsType: 'avl_unit',
          propName: 'sys_name',
          propValueMask: '*',
          sortType: 'sys_name',
        },
        force: 1,
        flags: 1025, // Basic info + position
        from: 0,
        to: 0,
      },
      true,
    );
  }

  /**
   * Get unit by ID
   */
  async getUnit(unitId: number) {
    await this.ensureSession();

    return this.callAPI(
      'core/search_item',
      {
        id: unitId,
        flags: 1025,
      },
      true,
    );
  }

  /**
   * Get unit messages (track history)
   */
  async getUnitMessages(
    unitId: number,
    timeFrom: number,
    timeTo: number,
    flags = 0,
  ) {
    await this.ensureSession();

    return this.callAPI(
      'messages/load_interval',
      {
        itemId: unitId,
        timeFrom,
        timeTo,
        flags,
        flagsMask: 0,
        loadCount: 0xffffffff,
      },
      true,
    );
  }

  /**
   * Get geofences (zones)
   */
  async getGeofences() {
    await this.ensureSession();

    const resourceId = this.configService.get('WIALON_ACCOUNT_ID');

    return this.callAPI(
      'resource/get_zone_data',
      {
        itemId: parseInt(resourceId),
        col: [1, 2, 3, 4],
      },
      true,
    );
  }

  /**
   * Execute report
   */
  async executeReport(
    reportResourceId: number,
    reportTemplateId: number,
    objectId: number,
    interval: { from: number; to: number },
  ) {
    await this.ensureSession();

    // Execute report
    await this.callAPI(
      'report/exec_report',
      {
        reportResourceId,
        reportTemplateId,
        reportObjectId: objectId,
        reportObjectSecId: 0,
        interval,
      },
      true,
    );

    // Get report data
    const reportData = await this.callAPI('report/get_report_data', {}, true);

    // Clean up
    await this.callAPI('report/cleanup_result', {}, true);

    return reportData;
  }

  /**
   * Send command to unit
   */
  async sendCommand(unitId: number, commandName: string, params: any = {}) {
    await this.ensureSession();

    return this.callAPI(
      'unit/exec_cmd',
      {
        itemId: unitId,
        commandName,
        ...params,
      },
      true,
    );
  }

  /**
   * Create geofence
   */
  async createGeofence(resourceId: number, geofenceData: any) {
    await this.ensureSession();

    return this.callAPI(
      'resource/update_zone',
      {
        itemId: resourceId,
        id: 0, // 0 for new
        callMode: 'create',
        ...geofenceData,
      },
      true,
    );
  }

  /**
   * Update geofence
   */
  async updateGeofence(resourceId: number, zoneId: number, geofenceData: any) {
    await this.ensureSession();

    return this.callAPI(
      'resource/update_zone',
      {
        itemId: resourceId,
        id: zoneId,
        callMode: 'update',
        ...geofenceData,
      },
      true,
    );
  }

  /**
   * Delete geofence
   */
  async deleteGeofence(resourceId: number, zoneId: number) {
    await this.ensureSession();

    return this.callAPI(
      'resource/update_zone',
      {
        itemId: resourceId,
        id: zoneId,
        callMode: 'delete',
      },
      true,
    );
  }

  /**
   * Generic API call
   */
  async callAPI(service: string, params: any = {}, useSession = false) {
    const body = new URLSearchParams({
      svc: service,
      params: JSON.stringify(params),
    });

    if (useSession && this.sessionId) {
      body.append('sid', this.sessionId);
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post<any>(this.apiUrl, body.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      if (response.data.error) {
        throw new Error(`Wialon API Error ${response.data.error}`);
      }

      return response.data;
    } catch (error: any) {
      this.logger.error(`Wialon API call failed: ${service}`, error.message);
      throw error;
    }
  }

  /**
   * Ensure we have a valid session
   */
  private async ensureSession() {
    if (!this.sessionId) {
      await this.login();
    }
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }
}
