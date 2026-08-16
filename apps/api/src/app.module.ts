import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './config/jwt.config';

import { LoggerModule } from './common/logger/logger.module';
import { ProductModule } from './product/product.module';

import { SettingsModule } from './settings/settings.module';
import { UploadModule } from './upload/upload.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

import { CategoryModule } from './category/category.module';
import { ProductImageModule } from './product-image/product-image.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 900000, // 15 minutes (in milliseconds for NestJS v5+ or seconds depending on version, let's use seconds for typical setup wait, wait! 15 * 60 * 1000 is 900000 ms in throttler v5. Let's use ttl: 900000, limit: 10)
      limit: 10,
    }]),
    LoggerModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    SettingsModule,
    UploadModule,
    CloudinaryModule,
    ProductImageModule,
    OrdersModule,
    CustomersModule,
  ],
})
export class AppModule {}
