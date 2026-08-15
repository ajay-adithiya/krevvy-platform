import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
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
      getOrders: jest.fn().mockImplementation((dto) => {
        return {
          data: [{ id: 'order_1', status: 'PAID' }],
          pagination: { page: dto.page || 1, limit: dto.limit || 10, total: 1, totalPages: 1 }
        };
      }),
      getOrderById: jest.fn().mockImplementation((id) => {
        if (id === 'existing_order') return { id, status: 'PAID', items: [] };
        throw new NotFoundException('Order not found');
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

  it('A. Admin order list requires authentication (Metadata Check)', () => {
    // In NestJS we test if the guard is applied using Reflect API
    const guards = Reflect.getMetadata('__guards__', controller.getOrders);
    expect(guards).toBeDefined();
    expect(guards[0].name).toBe('JwtAuthGuard');
  });

  it('B. Admin order list returns pagination', async () => {
    const response = await controller.getOrders({ page: 2, limit: 5 });
    expect(response.pagination).toBeDefined();
    expect(response.pagination.page).toBe(2);
    expect(response.pagination.limit).toBe(5);
    expect(response.pagination.total).toBe(1);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('C. Admin order details returns the requested order', async () => {
    const order = await controller.getOrderById('existing_order');
    expect(order.id).toBe('existing_order');
    expect(order.items).toBeDefined();
  });

  it('D. Missing order returns 404', async () => {
    await expect(controller.getOrderById('missing_order')).rejects.toThrow('Order not found');
  });
});
