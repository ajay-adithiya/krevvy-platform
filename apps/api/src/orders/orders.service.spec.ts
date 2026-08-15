import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { BadRequestException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let mockPrisma: any;

  beforeAll(() => {
    process.env.RAZORPAY_KEY_ID = 'test_key';
    process.env.RAZORPAY_KEY_SECRET = 'test_secret';
  });

  beforeEach(async () => {
    // A mock PrismaService that can simulate concurrency by tracking state
    let dbOrder = {
      id: 'order_1',
      status: 'PENDING_PAYMENT',
      isPaid: false,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      items: [{ productId: 'prod_1', quantity: 1, price: 100 }]
    };

    let dbProduct = {
      id: 'prod_1',
      stock: 1,
      reservedStock: 0,
      price: 100,
      isActive: true,
      name: 'Test Product'
    };

    mockPrisma = {
      $transaction: jest.fn(async (callback) => {
        return callback(mockPrisma);
      }),
      $executeRaw: jest.fn(async () => {
        // Atomic reservation mock
        if (dbProduct.stock - dbProduct.reservedStock >= 1) {
          dbProduct.reservedStock += 1;
          return 1; // 1 row updated
        }
        return 0; // 0 rows updated (insufficient stock)
      }),
      product: {
        findMany: jest.fn().mockResolvedValue([dbProduct]),
        update: jest.fn().mockImplementation(({ data }) => {
          if (data.stock?.decrement) dbProduct.stock -= data.stock.decrement;
          if (data.reservedStock?.decrement) dbProduct.reservedStock -= data.reservedStock.decrement;
          return dbProduct;
        })
      },
      order: {
        create: jest.fn().mockResolvedValue(dbOrder),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.id === 'order_1' || where.razorpayOrderId === 'razor_order_1') return dbOrder;
          return null;
        }),
        update: jest.fn().mockImplementation(({ data }) => {
          dbOrder = { ...dbOrder, ...data };
          return dbOrder;
        }),
        updateMany: jest.fn().mockImplementation(({ where, data }) => {
          // OCC logic
          if (where.id === dbOrder.id && where.status === dbOrder.status && (where.isPaid === undefined || where.isPaid === dbOrder.isPaid)) {
            dbOrder = { ...dbOrder, ...data };
            return { count: 1 };
          }
          return { count: 0 };
        })
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: LoggerService, useValue: { log: jest.fn(), error: jest.fn() } }
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('A. Reservation: concurrent reservation of the final unit allows only one reservation', async () => {
    // Both requests try to checkout the same item with stock 1
    const request = { items: [{ productId: 'prod_1', quantity: 1 }], customerName: 'Test', customerEmail: 'test@test.com', customerPhone: '123', shippingAddressLine1: 'Line 1', shippingCity: 'City', shippingState: 'State', shippingPostalCode: '123', shippingCountry: 'Country' };

    // Simulate validation passing for both simultaneously before transactions start
    jest.spyOn(service, 'validateCheckout').mockResolvedValue({
      subTotal: 100, shippingFee: 0, tax: 0, totalAmount: 100,
      items: [{ productId: 'prod_1', name: 'Test Product', price: 100, quantity: 1, subTotal: 100 }]
    });
    jest.spyOn(service as any, 'generateOrderNumber').mockReturnValue('KREV-1234');
    (service as any).razorpay = { orders: { create: jest.fn().mockResolvedValue({ id: 'razor_order_1' }) } };

    const results = await Promise.allSettled([
      service.createOrder(request),
      service.createOrder(request)
    ]);

    const successes = results.filter(r => r.status === 'fulfilled');
    const failures = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];

    if (successes.length !== 1) console.error('Failures:', failures.map(f => f.reason));

    expect(successes.length).toBe(1); // Only one should succeed
    expect(failures.length).toBe(1); // The other must fail
  });

  it('B. Payment: successful payment consumes stock exactly once', async () => {
    jest.spyOn(require('razorpay/dist/utils/razorpay-utils'), 'validatePaymentVerification').mockReturnValue(true);

    const results = await Promise.allSettled([
      service.verifyPayment({ razorpay_order_id: 'razor_order_1', razorpay_payment_id: 'pay_1', razorpay_signature: 'sig' }),
      service.verifyPayment({ razorpay_order_id: 'razor_order_1', razorpay_payment_id: 'pay_1', razorpay_signature: 'sig' })
    ]);

    expect(mockPrisma.product.update).toHaveBeenCalledTimes(1); // Stock decremented exactly once
    expect(results[0].status).toBe('fulfilled');
    expect(results[1].status).toBe('fulfilled'); // Second is idempotent, returning already paid
  });

  it('C. Failed payment: payment.failed releases reservation, but cannot release a PAID order', async () => {
    const rawBody = Buffer.from(JSON.stringify({
      event: 'payment.failed',
      payload: { payment: { entity: { order_id: 'razor_order_1', error_description: 'Failed' } } }
    }));
    jest.spyOn(require('razorpay/dist/utils/razorpay-utils'), 'validateWebhookSignature').mockReturnValue(true);

    // Initial state: PENDING_PAYMENT. It should release
    await service.handleWebhook(rawBody, 'sig');
    expect(mockPrisma.product.update).toHaveBeenCalledTimes(1); // Released

    // Reset and make it PAID
    mockPrisma.product.update.mockClear();
    mockPrisma.order.findUnique.mockResolvedValue({ status: 'PAID' });

    await service.handleWebhook(rawBody, 'sig');
    expect(mockPrisma.product.update).toHaveBeenCalledTimes(0); // Cannot release a paid order
  });

  it('D. Expiration: expired reservation releases stock, expiration cannot release a reservation after successful payment', async () => {
    // Initial state: PENDING_PAYMENT
    mockPrisma.order.findMany = jest.fn().mockResolvedValue([{ id: 'order_1', status: 'PENDING_PAYMENT', items: [{ productId: 'prod_1', quantity: 1 }] }]);
    await service.expireReservations();
    expect(mockPrisma.product.update).toHaveBeenCalledTimes(1); // Released

    // Simulate a concurrent payment that just completed and changed the state to PAID
    mockPrisma.product.update.mockClear();
    mockPrisma.order.findUnique.mockResolvedValue({ id: 'order_1', status: 'PAID' }); // Wait, updateMany OCC handles this, but since findUnique is used first, we can mock it here
    mockPrisma.order.updateMany.mockReturnValue({ count: 0 }); // OCC fails because it's no longer PENDING_PAYMENT

    await service.expireReservations();
    expect(mockPrisma.product.update).toHaveBeenCalledTimes(0); // Must not release if it's already paid
  });

  // --- Phase 4A Status Transition Tests ---

  it('E. PAID -> PROCESSING succeeds', async () => {
    mockPrisma.order.findUnique = jest.fn().mockResolvedValue({ id: 'order_paid', status: 'PAID' });
    mockPrisma.order.updateMany = jest.fn().mockReturnValue({ count: 1 });

    await service.updateOrderStatus('order_paid', { status: 'PROCESSING' } as any);
    expect(mockPrisma.order.updateMany).toHaveBeenCalledWith({
      where: { id: 'order_paid', status: 'PAID' },
      data: { status: 'PROCESSING' }
    });
  });

  it('F. PROCESSING -> SHIPPED succeeds', async () => {
    mockPrisma.order.findUnique = jest.fn().mockResolvedValue({ id: 'order_proc', status: 'PROCESSING' });
    mockPrisma.order.updateMany = jest.fn().mockReturnValue({ count: 1 });

    await service.updateOrderStatus('order_proc', { status: 'SHIPPED' } as any);
    expect(mockPrisma.order.updateMany).toHaveBeenCalledWith({
      where: { id: 'order_proc', status: 'PROCESSING' },
      data: { status: 'SHIPPED' }
    });
  });

  it('G. SHIPPED -> DELIVERED succeeds', async () => {
    mockPrisma.order.findUnique = jest.fn().mockResolvedValue({ id: 'order_ship', status: 'SHIPPED' });
    mockPrisma.order.updateMany = jest.fn().mockReturnValue({ count: 1 });

    await service.updateOrderStatus('order_ship', { status: 'DELIVERED' } as any);
    expect(mockPrisma.order.updateMany).toHaveBeenCalledWith({
      where: { id: 'order_ship', status: 'SHIPPED' },
      data: { status: 'DELIVERED' }
    });
  });

  it('H. Invalid transition is rejected', async () => {
    mockPrisma.order.findUnique = jest.fn().mockResolvedValue({ id: 'order_paid', status: 'PAID' });
    await expect(service.updateOrderStatus('order_paid', { status: 'DELIVERED' } as any)).rejects.toThrow('Invalid status transition from PAID to DELIVERED');
  });

  it('I. PENDING_PAYMENT cannot become PROCESSING', async () => {
    mockPrisma.order.findUnique = jest.fn().mockResolvedValue({ id: 'order_pend', status: 'PENDING_PAYMENT' });
    await expect(service.updateOrderStatus('order_pend', { status: 'PROCESSING' } as any)).rejects.toThrow('Invalid status transition');
  });

  it('J. PAYMENT_FAILED cannot become PROCESSING', async () => {
    mockPrisma.order.findUnique = jest.fn().mockResolvedValue({ id: 'order_fail', status: 'PAYMENT_FAILED' });
    await expect(service.updateOrderStatus('order_fail', { status: 'PROCESSING' } as any)).rejects.toThrow('Invalid status transition');
  });

  it('K. EXPIRED cannot become PROCESSING', async () => {
    mockPrisma.order.findUnique = jest.fn().mockResolvedValue({ id: 'order_exp', status: 'EXPIRED' });
    await expect(service.updateOrderStatus('order_exp', { status: 'PROCESSING' } as any)).rejects.toThrow('Invalid status transition');
  });

  it('L. DELIVERED cannot transition again', async () => {
    mockPrisma.order.findUnique = jest.fn().mockResolvedValue({ id: 'order_del', status: 'DELIVERED' });
    await expect(service.updateOrderStatus('order_del', { status: 'PROCESSING' } as any)).rejects.toThrow('Invalid status transition');
  });
});
