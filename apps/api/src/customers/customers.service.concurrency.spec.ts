import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

describe('CustomersService Concurrency', () => {
  let service: CustomersService;
  let prisma: PrismaService;

  const testEmail = 'concurrency_test@example.com';
  let testCustomer: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        PrismaService,
        {
          provide: EmailService,
          useValue: { sendOtpEmail: jest.fn().mockResolvedValue(true) },
        },
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: (key: string) => {
              if (key === 'JWT_CUSTOMER_SECRET') return 'secret';
              if (key === 'JWT_CUSTOMER_REFRESH_SECRET') return 'refresh_secret';
              if (key === 'DATABASE_URL') return process.env.DATABASE_URL;
              return null;
            },
          },
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Cleanup
    await prisma.otpCode.deleteMany({ where: { email: testEmail } });
    await prisma.otpRateLimit.deleteMany({ where: { email: testEmail } });
    if (testCustomer) {
      await prisma.customerSession.deleteMany({ where: { customerId: testCustomer.id } });
      await prisma.customer.deleteMany({ where: { email: testEmail } });
    }
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.otpCode.deleteMany({ where: { email: testEmail } });
    await prisma.otpRateLimit.deleteMany({ where: { email: testEmail } });
    if (testCustomer) {
       await prisma.customerSession.deleteMany({ where: { customerId: testCustomer.id } });
    }
  });

  it('TEST 2: 20 concurrent requestOtp calls for the SAME normalized email during an empty rate-limit window allow max 3', async () => {
    const promises = [];
    for (let i = 0; i < 20; i++) {
      promises.push(service.requestOtp(testEmail));
    }

    await Promise.all(promises);

    const now = new Date();
    const windowStart = new Date(Math.floor(now.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000));

    const rateLimit = await prisma.otpRateLimit.findUnique({
      where: { email_windowStart: { email: testEmail, windowStart } }
    });

    // Exactly 3 requests should be recorded
    expect(rateLimit).toBeDefined();
    expect(rateLimit?.requestCount).toBe(3);

    // Exactly 3 OTPs should be generated
    const otps = await prisma.otpCode.findMany({ where: { email: testEmail } });
    expect(otps.length).toBe(3);
  });

  it('TEST 1: Two concurrent verifyOtp requests using the SAME valid OTP succeed exactly ONE', async () => {
    // Create an OTP
    const otp = '123456';
    const codeHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const otpRecord = await prisma.otpCode.create({
      data: {
        email: testEmail,
        codeHash,
        expiresAt,
      },
    });

    const verify1 = service.verifyOtp(testEmail, otp);
    const verify2 = service.verifyOtp(testEmail, otp);
    const verify3 = service.verifyOtp(testEmail, otp);

    const results = await Promise.allSettled([verify1, verify2, verify3]);

    const successes = results.filter(r => r.status === 'fulfilled');
    const failures = results.filter(r => r.status === 'rejected');

    // Exactly one should succeed
    expect(successes.length).toBe(1);
    expect(failures.length).toBe(2);

    const successfulResult = (successes[0] as any).value;
    expect(successfulResult.accessToken).toBeDefined();
    expect(successfulResult.refreshToken).toBeDefined();

    const dbRecord = await prisma.otpCode.findUnique({ where: { id: otpRecord.id } });
    expect(dbRecord?.isConsumed).toBe(true);

    // Store customer for teardown
    testCustomer = await prisma.customer.findUnique({ where: { email: testEmail } });
  });

  it('TEST 3 & 4: Refresh token rotation, logout revocation', async () => {
     // Generate OTP
     const otp = '999999';
     const codeHash = await bcrypt.hash(otp, 10);
     await prisma.otpCode.create({
       data: { email: testEmail, codeHash, expiresAt: new Date(Date.now() + 1000000) }
     });

     // Login
     const tokens = await service.verifyOtp(testEmail, otp);
     const rt1 = tokens.refreshToken;

     // Use refresh token
     const tokens2 = await service.refresh(rt1);
     const rt2 = tokens2.refreshToken;

     // Attempt to reuse old refresh token
     await expect(service.refresh(rt1)).rejects.toThrow('Session revoked');

     // Use new refresh token
     const tokens3 = await service.refresh(rt2);
     const rt3 = tokens3.refreshToken;

     // Logout
     await service.logout(rt3);

     // Attempt to use after logout
     await expect(service.refresh(rt3)).rejects.toThrow('Session revoked');
  });
});
