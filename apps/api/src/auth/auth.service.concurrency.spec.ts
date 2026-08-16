import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../common/logger/logger.service';

describe('AuthService Concurrency', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const testEmail = 'admin_concurrency@example.com';
  let testAdmin: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({ secret: 'test_secret', signOptions: { expiresIn: '15m' } }),
      ],
      providers: [
        AuthService,
        PrismaService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: (key: string) => {
              if (key === 'jwt.refreshSecret') return 'admin_refresh_secret';
              if (key === 'DATABASE_URL') return process.env.DATABASE_URL;
              return null;
            },
          },
        },
        {
          provide: LoggerService,
          useValue: { log: jest.fn(), warn: jest.fn(), error: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Cleanup
    if (testAdmin) {
      await prisma.adminSession.deleteMany({ where: { adminId: testAdmin.id } });
      await prisma.admin.deleteMany({ where: { email: testEmail } });
    }
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    if (testAdmin) {
       await prisma.adminSession.deleteMany({ where: { adminId: testAdmin.id } });
    }
  });

  it('TEST: Concurrent refresh with same token succeeds exactly ONE time', async () => {
    // Register
    const registerResponse = await service.registerAdmin({
        email: testEmail,
        password: 'Password123!',
    });
    testAdmin = registerResponse.admin;

    // Login
    const loginTokens = await service.login({ email: testEmail, password: 'Password123!' });
    const initialRefreshToken = loginTokens.refreshToken;

    // Fire 3 concurrent refresh requests
    const refresh1 = service.refresh(initialRefreshToken);
    const refresh2 = service.refresh(initialRefreshToken);
    const refresh3 = service.refresh(initialRefreshToken);

    const results = await Promise.allSettled([refresh1, refresh2, refresh3]);

    const successes = results.filter(r => r.status === 'fulfilled');
    const failures = results.filter(r => r.status === 'rejected');

    // Exactly one should succeed
    expect(successes.length).toBe(1);
    expect(failures.length).toBe(2);

    const successfulResult = (successes[0] as any).value;
    expect(successfulResult.accessToken).toBeDefined();
    expect(successfulResult.refreshToken).toBeDefined();

    // Verify database has exactly 2 sessions (one revoked, one active)
    const sessions = await prisma.adminSession.findMany({ where: { adminId: testAdmin.id } });
    expect(sessions.length).toBe(2);

    const activeSessions = sessions.filter(s => s.revokedAt === null);
    const revokedSessions = sessions.filter(s => s.revokedAt !== null);

    expect(activeSessions.length).toBe(1);
    expect(revokedSessions.length).toBe(1);
  });

  it('TEST: Old rotated refresh token cannot be reused', async () => {
    // Login to get fresh tokens
    const loginTokens = await service.login({ email: testEmail, password: 'Password123!' });
    const rt1 = loginTokens.refreshToken;

    // Rotate once
    const tokens2 = await service.refresh(rt1);
    const rt2 = tokens2.refreshToken;

    // Attempt to reuse rt1
    await expect(service.refresh(rt1)).rejects.toThrow('Session revoked');

    // rt2 should still work
    const tokens3 = await service.refresh(rt2);
    expect(tokens3.accessToken).toBeDefined();
  });

  it('TEST: Logout revokes session and prevents further refresh', async () => {
    const loginTokens = await service.login({ email: testEmail, password: 'Password123!' });
    const rt1 = loginTokens.refreshToken;

    // Logout
    await service.logout(rt1);

    // Refresh should fail
    await expect(service.refresh(rt1)).rejects.toThrow('Session revoked');
  });
});
