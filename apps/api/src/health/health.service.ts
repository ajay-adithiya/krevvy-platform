import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly version: string;

  constructor(private readonly prisma: PrismaService) {
    try {
      const pkgPath = path.resolve(process.cwd(), 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      this.version = pkg.version || '1.0.0';
    } catch (e) {
      this.version = '1.0.0';
    }
  }

  getLiveness() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      version: this.version,
    };
  }

  async getReadiness() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        uptime: process.uptime(),
        version: this.version,
        database: {
          status: 'connected',
        },
      };
    } catch (error) {
      this.logger.warn(`Database readiness check failed: ${error.message || 'Unknown error'}`);
      return {
        status: 'error',
        uptime: process.uptime(),
        version: this.version,
        database: {
          status: 'disconnected',
        },
      };
    }
  }
}
