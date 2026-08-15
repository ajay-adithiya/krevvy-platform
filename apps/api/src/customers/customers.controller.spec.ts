import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { CustomerJwtAuthGuard } from './guards/customer-jwt-auth.guard';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  const mockCustomersService = {
    requestOtp: jest.fn(),
    verifyOtp: jest.fn(),
    refresh: jest.fn(),
    getCustomerProfile: jest.fn(),
    getCustomerOrders: jest.fn(),
    getCustomerOrderById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([{
          ttl: 900,
          limit: 10,
        }]),
      ],
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(CustomerJwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          if (!req.user || req.user.type !== 'customer') {
            throw new UnauthorizedException('Customer authentication required');
          }
          return true;
        },
      })
      .compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should allow customer token to access profile', async () => {
    const req = { user: { id: 'cust-123', email: 'test@example.com', type: 'customer' } };
    mockCustomersService.getCustomerProfile.mockResolvedValue({ id: 'cust-123' });

    const result = await controller.getProfile(req);
    expect(result).toEqual({ id: 'cust-123' });
    expect(mockCustomersService.getCustomerProfile).toHaveBeenCalledWith('cust-123');
  });

  // NestJS guards in unit tests are typically tested independently or in e2e tests.
  // The override above simulates the guard logic.
});
