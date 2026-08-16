import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthService', () => {
  let service: HealthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLiveness', () => {
    it('should return ok status', () => {
      const result = service.getLiveness();
      expect(result.status).toBe('ok');
      expect(result.version).toBeDefined();
      expect(result.uptime).toBeDefined();
    });
  });

  describe('getReadiness', () => {
    it('should return ok when db query succeeds', async () => {
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.getReadiness();
      expect(result.status).toBe('ok');
      expect(result.database.status).toBe('connected');
      expect(result.database).not.toHaveProperty('credentials');
    });

    it('should return error when db query fails', async () => {
      jest.spyOn(prisma, '$queryRaw').mockRejectedValue(new Error('Connection failed'));

      const result = await service.getReadiness();
      expect(result.status).toBe('error');
      expect(result.database.status).toBe('disconnected');
      expect(result.database).not.toHaveProperty('error');
    });
  });
});
