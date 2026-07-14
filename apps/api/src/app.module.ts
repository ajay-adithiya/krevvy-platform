import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './config/jwt.config';

import { LoggerModule } from './common/logger/logger.module';
import { ProductModule } from './product/product.module';

import { SettingsModule } from './settings/settings.module';
import { UploadModule } from './upload/upload.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    LoggerModule,
    PrismaModule,
    AuthModule,
    ProductModule,
    SettingsModule,
    SettingsModule,
    UploadModule,
    CloudinaryModule,
  ],
})
export class AppModule {}