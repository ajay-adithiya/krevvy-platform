import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check readiness of the API and Database' })
  @ApiResponse({ status: 200, description: 'API is ready' })
  @ApiResponse({ status: 503, description: 'API is not ready' })
  async getReadiness() {
    const result = await this.healthService.getReadiness();
    if (result.status === 'error') {
      throw new ServiceUnavailableException(result);
    }
    return result;
  }

  @Get('live')
  @ApiOperation({ summary: 'Check liveness of the API process' })
  @ApiResponse({ status: 200, description: 'API is live' })
  getLiveness() {
    return this.healthService.getLiveness();
  }
}
