import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('CustomersService', () => {
  let service: CustomersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    otpCode: {
      count: jest.fn(),
      updateMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    otpRateLimit: {
      upsert: jest.fn(),
      updateMany: jest.fn(),
    },
    customerSession: {
      create: jest.fn(),
      findUnique: jest.fn(),
      updateMany: jest.fn(),
      update: jest.fn(),
    },
    customer: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
    },
    order: {
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    }
  };

  const mockEmailService = {
    sendOtpEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      if (key === 'JWT_CUSTOMER_SECRET') return 'test-secret';
      if (key === 'JWT_CUSTOMER_REFRESH_SECRET') return 'test-refresh-secret';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requestOtp', () => {
    it('should limit requests to 3 per 15 minutes', async () => {
      mockPrismaService.otpRateLimit.updateMany.mockResolvedValue({ count: 0 });

      const res = await service.requestOtp('test@example.com');

      expect(res.message).toBe('If the email can receive an OTP, a verification code has been sent.');
      expect(mockPrismaService.otpCode.create).not.toHaveBeenCalled();
    });

    it('should generate OTP and hash it if under limit', async () => {
      mockPrismaService.otpRateLimit.updateMany.mockResolvedValue({ count: 1 });
      mockPrismaService.otpCode.create.mockResolvedValue({ id: 'otp-1' });

      await service.requestOtp('test@example.com');

      expect(mockPrismaService.otpCode.create).toHaveBeenCalled();
      expect(mockEmailService.sendOtpEmail).toHaveBeenCalled();
    });
  });

  describe('verifyOtp', () => {
    it('should throw if no valid OTP found', async () => {
      mockPrismaService.otpCode.findFirst.mockResolvedValue(null);
      await expect(service.verifyOtp('test@example.com', '123456')).rejects.toThrow(BadRequestException);
    });

    it('should throw and invalidate if attempts >= 5', async () => {
      mockPrismaService.otpCode.findFirst.mockResolvedValue({
        id: 'otp-1',
        attempts: 5,
        codeHash: 'hash',
        isConsumed: false,
      });

      await expect(service.verifyOtp('test@example.com', '123456')).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.otpCode.updateMany).toHaveBeenCalledWith({
        where: { id: 'otp-1', isConsumed: false },
        data: { isConsumed: true },
      });
    });

    it('should verify correct OTP, upsert customer and return tokens', async () => {
      const codeHash = await bcrypt.hash('123456', 10);
      mockPrismaService.otpCode.findFirst.mockResolvedValue({
        id: 'otp-1',
        attempts: 0,
        codeHash,
        isConsumed: false,
      });

      mockPrismaService.otpCode.updateMany.mockResolvedValue({ count: 1 });

      mockPrismaService.customer.upsert.mockResolvedValue({
        id: 'cust-1',
        email: 'test@example.com',
      });

      mockPrismaService.customerSession.create.mockResolvedValue({
        id: 'session-1',
        customerId: 'cust-1',
        refreshTokenHash: 'hash',
        expiresAt: new Date(),
      });

      mockJwtService.signAsync.mockResolvedValueOnce('access-token').mockResolvedValueOnce('refresh-token');

      const res = await service.verifyOtp('test@example.com', '123456');

      expect(res.accessToken).toBe('access-token');
      expect(res.refreshToken).toBe('refresh-token');
      expect(mockPrismaService.otpCode.updateMany).toHaveBeenCalledWith({
        where: { id: 'otp-1', isConsumed: false },
        data: { isConsumed: true },
      });
    });
  });
});
