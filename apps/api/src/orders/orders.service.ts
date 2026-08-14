import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { ValidateCheckoutDto } from './dto/validate-checkout.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import Razorpay from 'razorpay';
import { validatePaymentVerification, validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';

@Injectable()
export class OrdersService {
  private razorpay: Razorpay;

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
  }

  async validateCheckout(dto: ValidateCheckoutDto) {
    const productIds = dto.items.map((i) => i.productId);
    
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    
    let subTotal = 0;
    const validatedItems: any[] = [];
    const errors: string[] = [];

    for (const item of dto.items) {
      const product = productMap.get(item.productId);
      
      if (!product) {
        errors.push(`Product not found or inactive: ${item.productId}`);
        continue;
      }
      
      const availableStock = product.stock - product.reservedStock;
      if (availableStock < item.quantity) {
        errors.push(`Insufficient stock for ${product.name}. Available: ${availableStock}, Requested: ${item.quantity}`);
        continue;
      }
      
      const itemTotal = Number(product.price) * item.quantity;
      subTotal += itemTotal;
      
      validatedItems.push({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: item.quantity,
        subTotal: itemTotal,
      });
    }

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Validation failed', errors });
    }

    // Example fixed fees for Phase 1
    const shippingFee = subTotal > 5000 ? 0 : 150;
    const tax = subTotal * 0.18; // 18% GST example
    const totalAmount = subTotal + shippingFee + tax;

    return {
      subTotal,
      shippingFee,
      tax,
      totalAmount,
      items: validatedItems,
    };
  }

  private generateOrderNumber(): string {
    const prefix = 'KREV';
    const random = Math.floor(10000 + Math.random() * 90000); // 5 digits
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}-${random}-${timestamp}`;
  }

  async createOrder(dto: CreateOrderDto) {
    // 1. Validate exactly like checkout
    const validationResult = await this.validateCheckout({ items: dto.items });

    // 2. Transaction to deduct stock and create order
    try {
      const order = await this.prisma.$transaction(async (tx) => {
        // Create the internal order
        const newOrder = await tx.order.create({
          data: {
            orderNumber: this.generateOrderNumber(),
            customerName: dto.customerName,
            customerEmail: dto.customerEmail,
            customerPhone: dto.customerPhone,
            shippingAddressLine1: dto.shippingAddressLine1,
            shippingAddressLine2: dto.shippingAddressLine2,
            shippingCity: dto.shippingCity,
            shippingState: dto.shippingState,
            shippingPostalCode: dto.shippingPostalCode,
            shippingCountry: dto.shippingCountry ?? 'India',
            subTotal: validationResult.subTotal,
            shippingFee: validationResult.shippingFee,
            tax: validationResult.tax,
            totalAmount: validationResult.totalAmount,
            status: 'PENDING_PAYMENT',
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            items: {
              create: validationResult.items.map((item) => ({
                productId: item.productId,
                productName: item.name,
                priceAtTime: item.price,
                quantity: item.quantity,
              })),
            },
          },
          include: {
            items: true,
          }
        });

        // Atomic reserve stock
        for (const item of validationResult.items) {
          const updatedRows = await tx.$executeRaw`
            UPDATE "Product"
            SET "reservedStock" = "reservedStock" + ${item.quantity}
            WHERE id = ${item.productId}
              AND ("stock" - "reservedStock") >= ${item.quantity}
          `;
          
          if (updatedRows === 0) {
            throw new BadRequestException(`Insufficient stock for ${item.name} during reservation.`);
          }
        }

        return newOrder;
      });

      this.logger.log(`Internal Order created successfully: ${order.orderNumber}`, OrdersService.name);

      // 3. Create Razorpay order
      const amountInPaise = Math.round(validationResult.totalAmount * 100);
      const razorpayOrder = await this.razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: order.orderNumber,
      });

      if (!razorpayOrder || !razorpayOrder.id) {
        throw new InternalServerErrorException('Failed to create Razorpay Order');
      }

      // 4. Update internal order with razorpayOrderId
      const updatedOrder = await this.prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: razorpayOrder.id },
      });

      return updatedOrder;
    } catch (error) {
      this.logger.error(`Order creation failed: ${error.message}`, error.stack, OrdersService.name);
      throw new BadRequestException('Order creation failed due to concurrency, payment provider, or database error.');
    }
  }

  async verifyPayment(body: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const isValid = validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET || ''
    );

    if (!isValid) {
      this.logger.error(`Invalid payment signature for order: ${razorpay_order_id}`);
      throw new BadRequestException('Invalid payment signature');
    }

    try {
      const resultOrder = await this.prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { razorpayOrderId: razorpay_order_id },
          include: { items: true }
        });

        if (!order) {
          throw new BadRequestException('Order not found');
        }

        if (order.isPaid || order.status === 'PAID') {
          return order; // Already paid
        }

        if (order.status !== 'PENDING_PAYMENT') {
          throw new BadRequestException('Order is no longer pending payment');
        }

        if (order.expiresAt && order.expiresAt < new Date()) {
          throw new BadRequestException('Order reservation has expired');
        }

        // Atomic OCC update
        const updateResult = await tx.order.updateMany({
          where: { 
            id: order.id, 
            status: 'PENDING_PAYMENT',
            isPaid: false
          },
          data: {
            isPaid: true,
            status: 'PAID',
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            paidAt: new Date(),
          },
        });

        if (updateResult.count === 0) {
          // Another thread updated it
          return await tx.order.findUnique({ where: { id: order.id } });
        }

        // Convert reserved inventory into consumed inventory since we acquired the lock
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
              reservedStock: { decrement: item.quantity },
            },
          });
        }

        return { ...order, isPaid: true, status: 'PAID' };
      });

      this.logger.log(`Payment verified and order marked as paid: ${resultOrder?.orderNumber}`);
      return { success: true, message: 'Payment verified', order: resultOrder };
    } catch (error) {
      this.logger.error(`Payment verification transaction failed: ${error.message}`, error.stack);
      throw new BadRequestException(error.message);
    }
  }

  async getOrderStatus(razorpayOrderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { razorpayOrderId },
      select: { status: true, expiresAt: true },
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return order;
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    
    let event;
    try {
      // Validate signature
      const isValid = validateWebhookSignature(rawBody.toString('utf8'), signature, secret);
      if (!isValid) {
        throw new BadRequestException('Invalid webhook signature');
      }
      event = JSON.parse(rawBody.toString('utf8'));
    } catch (error) {
      this.logger.error(`Webhook validation failed: ${error.message}`);
      throw new BadRequestException(`Webhook Error: ${error.message}`);
    }

    // Process event
    if (event.event === 'payment.failed') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const errorReason = paymentEntity.error_description || paymentEntity.error_reason || 'Payment failed';

      if (orderId) {
        await this.prisma.$transaction(async (tx) => {
          const order = await tx.order.findUnique({ where: { razorpayOrderId: orderId }, include: { items: true } });
          if (order && order.status === 'PENDING_PAYMENT') {
            const updateResult = await tx.order.updateMany({
              where: { id: order.id, status: 'PENDING_PAYMENT' },
              data: { status: 'PAYMENT_FAILED', paymentError: errorReason },
            });
            
            if (updateResult.count === 1) {
              // Release reserved stock safely since we hold the OCC lock
              for (const item of order.items) {
                await tx.product.update({
                  where: { id: item.productId },
                  data: { reservedStock: { decrement: item.quantity } },
                });
              }
              this.logger.log(`Order ${order.orderNumber} payment failed recorded and stock released.`);
            }
          }
        });
      }
    } else if (event.event === 'order.paid') {
      const orderEntity = event.payload.order.entity;
      const orderId = orderEntity.id;

      if (orderId) {
        await this.prisma.$transaction(async (tx) => {
          const order = await tx.order.findUnique({ where: { razorpayOrderId: orderId }, include: { items: true } });
          if (order && !order.isPaid && order.status === 'PENDING_PAYMENT' && (!order.expiresAt || order.expiresAt >= new Date())) {
            const updateResult = await tx.order.updateMany({
              where: { id: order.id, status: 'PENDING_PAYMENT', isPaid: false },
              data: {
                isPaid: true,
                status: 'PAID',
                paidAt: new Date(),
              },
            });
            
            if (updateResult.count === 1) {
              // Consume stock safely
              for (const item of order.items) {
                await tx.product.update({
                  where: { id: item.productId },
                  data: {
                    stock: { decrement: item.quantity },
                    reservedStock: { decrement: item.quantity },
                  },
                });
              }
              this.logger.log(`Order ${order.orderNumber} marked as paid via webhook and stock consumed.`);
            }
          }
        });
      }
    }


    return { received: true };
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async expireReservations() {
    this.logger.log('Running reservation expiration job', OrdersService.name);
    
    // Find all orders that are PENDING_PAYMENT and expired
    const expiredOrders = await this.prisma.order.findMany({
      where: {
        status: 'PENDING_PAYMENT',
        expiresAt: { lt: new Date() },
      },
      include: { items: true },
    });

    for (const order of expiredOrders) {
      try {
        await this.prisma.$transaction(async (tx) => {
          // Verify it's still pending inside transaction with atomic update
          const currentOrder = await tx.order.findUnique({ where: { id: order.id } });
          if (currentOrder?.status === 'PENDING_PAYMENT') {
            const updateResult = await tx.order.updateMany({
              where: { id: order.id, status: 'PENDING_PAYMENT' },
              data: { status: 'EXPIRED' },
            });

            if (updateResult.count === 1) {
              // Release reserved stock safely
              for (const item of order.items) {
                await tx.product.update({
                  where: { id: item.productId },
                  data: { reservedStock: { decrement: item.quantity } },
                });
              }
              this.logger.log(`Released expired reservation for order ${order.orderNumber}`, OrdersService.name);
            }
          }
        });
      } catch (error) {
        this.logger.error(`Failed to release reservation for order ${order.orderNumber}: ${error.message}`, error.stack, OrdersService.name);
      }
    }
  }
}
