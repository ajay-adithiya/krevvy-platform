import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
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

    const plaintextRefreshToken = crypto.randomBytes(32).toString('hex');
    const refreshTokenHash = await bcrypt.hash(plaintextRefreshToken, 10);
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await this.prisma.adminSession.create({
      data: {
        adminId: admin.id,
        refreshTokenHash,
        expiresAt: sessionExpiresAt,
      },
    });

    const refreshPayload = {
      ...payload,
      sessionId: session.id,
      secret: plaintextRefreshToken,
    };

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: this.configService.getOrThrow<string>("jwt.refreshSecret"),
      expiresIn: '7d',
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

      if (!payload.sessionId || !payload.secret) {
        throw new UnauthorizedException('Invalid token structure');
      }

      const session = await this.prisma.adminSession.findUnique({
        where: { id: payload.sessionId },
      });

      if (!session) {
        throw new UnauthorizedException('Session not found');
      }

      if (session.revokedAt) {
        throw new UnauthorizedException('Session revoked');
      }

      if (session.expiresAt < new Date()) {
        throw new UnauthorizedException('Session expired');
      }

      const isValid = await bcrypt.compare(payload.secret, session.refreshTokenHash);
      if (!isValid) {
        throw new UnauthorizedException('Invalid session secret');
      }

      const admin = await this.prisma.admin.findUnique({
        where: { id: payload.sub },
      });

      if (!admin || admin.id !== session.adminId) {
        throw new UnauthorizedException('Admin mismatch');
      }

      const newPayload = {
        sub: admin.id,
        email: admin.email,
      };

      const newAccessToken = await this.jwtService.signAsync(newPayload);

      const plaintextRefreshToken = crypto.randomBytes(32).toString('hex');
      const refreshTokenHash = await bcrypt.hash(plaintextRefreshToken, 10);
      const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // Rotate session: revoke old and create new within a transaction
      const newSession = await this.prisma.$transaction(async (tx) => {
        const revokeResult = await tx.adminSession.updateMany({
          where: {
            id: session.id,
            revokedAt: null,
          },
          data: {
            revokedAt: new Date(),
          },
        });

        if (revokeResult.count !== 1) {
          throw new UnauthorizedException('Refresh token has already been used');
        }

        return tx.adminSession.create({
          data: {
            adminId: admin.id,
            refreshTokenHash,
            expiresAt: sessionExpiresAt,
          },
        });
      });

      const refreshPayload = {
        ...newPayload,
        sessionId: newSession.id,
        secret: plaintextRefreshToken,
      };

      const newRefreshToken = await this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: '7d',
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.warn('Refresh token validation failed', AuthService.name);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
      });

      if (payload.sessionId) {
        await this.prisma.adminSession.updateMany({
          where: { id: payload.sessionId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }
    } catch (error) {
      // Ignore if it's already invalid
    }
    return { success: true };
  }
}