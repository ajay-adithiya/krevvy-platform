import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let mockOrdersService: any;

  beforeEach(async () => {
    mockOrdersService = {
      getOrderStatus: jest.fn().mockImplementation((id) => {
        if (id === 'expired_order') return { status: 'PENDING_PAYMENT', expiresAt: new Date(Date.now() - 1000) };
        if (id === 'failed_order') return { status: 'PAYMENT_FAILED', expiresAt: new Date(Date.now() + 1000) };
        if (id === 'valid_order') return { status: 'PENDING_PAYMENT', expiresAt: new Date(Date.now() + 1000) };
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: OrdersService, useValue: mockOrdersService }
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('E. Retry: validates order status before allowing reuse (backend endpoint check)', async () => {
    const expired = await controller.getOrderStatus('expired_order');
    expect(expired.status).toBe('PENDING_PAYMENT');
    expect(expired.expiresAt.getTime()).toBeLessThan(Date.now()); // Expired

    const failed = await controller.getOrderStatus('failed_order');
    expect(failed.status).toBe('PAYMENT_FAILED'); // Cannot be reused

    const valid = await controller.getOrderStatus('valid_order');
    expect(valid.status).toBe('PENDING_PAYMENT');
    expect(valid.expiresAt.getTime()).toBeGreaterThan(Date.now()); // Can be reused
  });
});
