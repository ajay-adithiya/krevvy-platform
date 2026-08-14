import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    ScheduleModule.forRoot(),
    LoggerModule,
    PrismaModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    SettingsModule,
    UploadModule,
    CloudinaryModule,
    ProductImageModule,
    OrdersModule,
  ],
})
export class AppModule {}