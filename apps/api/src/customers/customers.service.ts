import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async requestOtp(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    // Rate limiting logic: Max 3 requests per 15 minutes per email
    const now = new Date();
    const windowStart = new Date(Math.floor(now.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000));

    // Ensure the bucket exists
    await this.prisma.otpRateLimit.upsert({
      where: { email_windowStart: { email: normalizedEmail, windowStart } },
      update: {},
      create: { email: normalizedEmail, windowStart, requestCount: 0 },
    });

    // Atomic increment using OCC-style filter
    const rateLimitUpdate = await this.prisma.otpRateLimit.updateMany({
      where: {
        email: normalizedEmail,
        windowStart,
        requestCount: { lt: 3 },
      },
      data: {
        requestCount: { increment: 1 },
      },
    });

    if (rateLimitUpdate.count === 0) {
      this.logger.warn(`OTP rate limit exceeded for email: ${normalizedEmail}`);
      // Return generic message to prevent enumeration
      return { message: 'If the email can receive an OTP, a verification code has been sent.' };
    }

    // Invalidate any active OTPs for this email (best-effort cleanup)
    await this.prisma.otpCode.updateMany({
      where: { email: normalizedEmail, isConsumed: false, expiresAt: { gt: new Date() } },
      data: { isConsumed: true },
    });

    // Generate secure 6 digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const codeHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.otpCode.create({
      data: {
        email: normalizedEmail,
        codeHash,
        expiresAt,
      },
    });

    try {
      await this.emailService.sendOtpEmail(normalizedEmail, otp);
    } catch (error) {
      // We don't expose internal errors to the user here.
      this.logger.error('Error sending OTP', error.stack);
    }

    return { message: 'If the email can receive an OTP, a verification code has been sent.' };
  }

  async verifyOtp(email: string, otp: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        email: normalizedEmail,
        isConsumed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (otpRecord.attempts >= 5) {
      // Safely invalidate if it's not already consumed
      await this.prisma.otpCode.updateMany({
        where: { id: otpRecord.id, isConsumed: false },
        data: { isConsumed: true },
      });
      throw new BadRequestException('Too many failed attempts. Please request a new OTP.');
    }

    const isValid = await bcrypt.compare(otp, otpRecord.codeHash);

    if (!isValid) {
      // Safely increment attempts
      const attemptUpdate = await this.prisma.otpCode.updateMany({
        where: { id: otpRecord.id, attempts: { lt: 5 }, isConsumed: false },
        data: { attempts: { increment: 1 } },
      });

      if (attemptUpdate.count === 0) {
        // If it was already consumed or attempts exceeded concurrently
        throw new BadRequestException('Invalid or expired OTP');
      }

      throw new BadRequestException('Invalid or expired OTP');
    }

    // Atomic consumption using updateMany
    const consumeUpdate = await this.prisma.otpCode.updateMany({
      where: { id: otpRecord.id, isConsumed: false },
      data: { isConsumed: true },
    });

    if (consumeUpdate.count === 0) {
      // OTP was already consumed concurrently
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Upsert customer
    const customer = await this.prisma.customer.upsert({
      where: { email: normalizedEmail },
      update: {},
      create: { email: normalizedEmail },
    });

    const payload = {
      sub: customer.id,
      email: customer.email,
      type: 'customer',
    };

    const secret = this.configService.getOrThrow<string>('JWT_CUSTOMER_SECRET');
    const refreshSecret = this.configService.getOrThrow<string>('JWT_CUSTOMER_REFRESH_SECRET');

    const accessToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '15m',
    });

    // Create a new Customer Session
    // We generate a random plaintext refresh token string
    const plaintextRefreshToken = crypto.randomBytes(32).toString('hex');
    const refreshTokenHash = await bcrypt.hash(plaintextRefreshToken, 10);
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await this.prisma.customerSession.create({
      data: {
        customerId: customer.id,
        refreshTokenHash,
        expiresAt: sessionExpiresAt,
      },
    });

    // Include the sessionId in the refresh token payload so we can look it up
    const refreshPayload = {
      ...payload,
      sessionId: session.id,
      secret: plaintextRefreshToken,
    };

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: refreshSecret,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const refreshSecret = this.configService.getOrThrow<string>('JWT_CUSTOMER_REFRESH_SECRET');
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
      });

      if (payload.type !== 'customer' || !payload.sessionId || !payload.secret) {
        throw new UnauthorizedException('Invalid token structure');
      }

      const session = await this.prisma.customerSession.findUnique({
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

      const customer = await this.prisma.customer.findUnique({
        where: { id: payload.sub },
      });

      if (!customer || customer.id !== session.customerId) {
        throw new UnauthorizedException('Customer mismatch');
      }

      const newPayload = {
        sub: customer.id,
        email: customer.email,
        type: 'customer',
      };

      const secret = this.configService.getOrThrow<string>('JWT_CUSTOMER_SECRET');

      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        secret,
        expiresIn: '15m',
      });

      const plaintextRefreshToken = crypto.randomBytes(32).toString('hex');
      const refreshTokenHash = await bcrypt.hash(plaintextRefreshToken, 10);
      const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // Rotate session: revoke old and create new within a transaction
      const newSession = await this.prisma.$transaction(async (tx) => {
        const revokeResult = await tx.customerSession.updateMany({
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

        return tx.customerSession.create({
          data: {
            customerId: customer.id,
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
        secret: refreshSecret,
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
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(refreshToken: string) {
    try {
      const refreshSecret = this.configService.getOrThrow<string>('JWT_CUSTOMER_REFRESH_SECRET');
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
      });

      if (payload.sessionId) {
        await this.prisma.customerSession.updateMany({
          where: { id: payload.sessionId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }
    } catch (error) {
      // Ignore if it's already invalid
    }
    return { success: true };
  }

  async getCustomerProfile(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    });
    if (!customer) throw new UnauthorizedException('Customer not found');
    return customer;
  }

  async getCustomerOrders(customerId: string, page: number = 1, limit: number = 10, status?: string) {
    const skip = (page - 1) * limit;

    const where: any = { customerId };
    if (status) {
      where.status = status;
    }

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          isPaid: true,
        }
      })
    ]);

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCustomerOrderById(customerId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      // Safe generic message, do not reveal if order exists for another user
      throw new BadRequestException('Order not found');
    }

    // Strip sensitive fields
    const { razorpaySignature, ...safeOrder } = order;
    return safeOrder;
  }
}
