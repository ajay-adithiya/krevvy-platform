import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { ServiceUnavailableException } from '@nestjs/common';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            getLiveness: jest.fn(),
            getReadiness: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLiveness', () => {
    it('should return liveness result', () => {
      const mockResult = { status: 'ok', uptime: 100, version: '1.0.0' };
      jest.spyOn(service, 'getLiveness').mockReturnValue(mockResult);

      expect(controller.getLiveness()).toEqual(mockResult);
    });
  });

  describe('getReadiness', () => {
    it('should return readiness result when status is ok', async () => {
      const mockResult = {
        status: 'ok',
        uptime: 100,
        version: '1.0.0',
        database: { status: 'connected' },
      };
      jest.spyOn(service, 'getReadiness').mockResolvedValue(mockResult);

      await expect(controller.getReadiness()).resolves.toEqual(mockResult);
    });

    it('should throw ServiceUnavailableException when status is error', async () => {
      const mockResult = {
        status: 'error',
        uptime: 100,
        version: '1.0.0',
        database: { status: 'disconnected' },
      };
      jest.spyOn(service, 'getReadiness').mockResolvedValue(mockResult);

      await expect(controller.getReadiness()).rejects.toThrow(
        ServiceUnavailableException,
      );
    });
  });
});
