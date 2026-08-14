import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, BadRequestException } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { OrdersService } from './orders.service';
import { ValidateCheckoutDto } from './dto/validate-checkout.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate cart items and calculate totals' })
  @ApiResponse({ status: 200, description: 'Cart validated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed (e.g. out of stock)' })
  async validateCheckout(@Body() validateCheckoutDto: ValidateCheckoutDto) {
    return this.ordersService.validateCheckout(validateCheckoutDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Razorpay payment signature' })
  async verifyPayment(@Body() body: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    return this.ordersService.verifyPayment(body);
  }

  @Get('status/:razorpayOrderId')
  @ApiOperation({ summary: 'Get order status by Razorpay ID' })
  async getOrderStatus(@Param('razorpayOrderId') razorpayOrderId: string) {
    return this.ordersService.getOrderStatus(razorpayOrderId);
  }

  @Post('webhook/razorpay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Razorpay webhooks' })
  async handleWebhook(@Req() req: RawBodyRequest<Request>) {
    const signature = req.headers['x-razorpay-signature'] as string;
    if (!req.rawBody) {
      throw new BadRequestException('Raw body not found. Make sure { rawBody: true } is configured in NestFactory.');
    }
    return this.ordersService.handleWebhook(req.rawBody, signature);
  }
}

