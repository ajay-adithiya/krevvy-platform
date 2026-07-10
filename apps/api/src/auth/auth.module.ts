import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import type { StringValue } from 'ms';

import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
 imports: [
  ConfigModule,

  PassportModule.register({
    defaultStrategy: 'jwt',
  }),

  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.getOrThrow<string>('jwt.secret'),
      signOptions: {
        expiresIn: configService.getOrThrow<string>(
          'jwt.expiresIn',
        ) as StringValue,
      },
    }),
  }),
],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}