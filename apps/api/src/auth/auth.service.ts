import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';

import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interfaces/login-response.interface';

import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async registerAdmin(registerDto: RegisterAdminDto) {
    const { email, password } = registerDto;

    this.logger.log(
      `Admin registration attempt for email: ${email}`,
      AuthService.name,
    );

    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
        this.logger.warn(
          `Registration failed. Admin already exists: ${email}`,
          AuthService.name,
        );
      throw new ConflictException('Admin already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await this.prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    this.logger.log(
      `Admin registered successfully: ${admin.email}`,
      AuthService.name,
    );

    return {
      message: 'Admin created successfully',
      admin: {
        id: admin.id,
        email: admin.email,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

  this.logger.log(`Login attempt for email: ${email}`, AuthService.name);

  const admin = await this.prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {

    throw new UnauthorizedException("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);


  if (!isPasswordValid) {

    throw new UnauthorizedException("Invalid email or password");
  }

  const payload = {
    sub: admin.id,
    email: admin.email,
  };

  const accessToken = await this.jwtService.signAsync(payload);


  const refreshToken = await this.jwtService.signAsync(payload, {
    secret: this.configService.getOrThrow<string>("jwt.refreshSecret"),
    expiresIn: this.configService.getOrThrow("jwt.refreshExpiresIn") as StringValue,
  });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<LoginResponse> {
    this.logger.log(`Refresh token attempt`, AuthService.name);
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
      });

      const admin = await this.prisma.admin.findUnique({
        where: { id: payload.sub },
      });

      if (!admin) {
        throw new UnauthorizedException('Admin not found');
      }

      const newPayload = {
        sub: admin.id,
        email: admin.email,
      };

      const newAccessToken = await this.jwtService.signAsync(newPayload);
      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: this.configService.getOrThrow('jwt.refreshExpiresIn') as StringValue,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      this.logger.warn(
        'Refresh token validation failed',
        AuthService.name,
      );
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}