import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards, BadRequestException } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard/jwt-auth.guard';
import { OptionalCustomerJwtAuthGuard } from '../customers/guards/optional-customer-jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { OrdersService } from './orders.service';
import { ValidateCheckoutDto } from './dto/validate-checkout.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a paginated list of orders (Admin)' })
  @ApiResponse({ status: 200, description: 'List of orders returned successfully' })
  async getOrders(@Query() getOrdersDto: GetOrdersDto) {
    return this.ordersService.getOrders(getOrdersDto);
  }



  @Post('checkout/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate cart items and calculate totals' })
  @ApiResponse({ status: 200, description: 'Cart validated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed (e.g. out of stock)' })
  async validateCheckout(@Body() validateCheckoutDto: ValidateCheckoutDto) {
    return this.ordersService.validateCheckout(validateCheckoutDto);
  }

  @Post()
  @UseGuards(OptionalCustomerJwtAuthGuard)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async createOrder(@Req() req: any, @Body() createOrderDto: CreateOrderDto) {
    const customerId = req.user?.id || null;
    return this.ordersService.createOrder(createOrderDto, customerId);
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get order details by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Order details returned successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update order status (Admin)' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
  }
}

