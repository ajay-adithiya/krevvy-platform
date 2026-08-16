import { Controller, Post, Body, Get, UseGuards, Req, Res, HttpCode, HttpStatus, Param, Query, UnauthorizedException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { CustomersService } from './customers.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshDto } from './dto/refresh.dto';
import { CustomerJwtAuthGuard } from './guards/customer-jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('auth/request-otp')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request an OTP for customer login/registration' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully (or rate limited safely)' })
  async requestOtp(@Body() body: RequestOtpDto) {
    return this.customersService.requestOtp(body.email);
  }

  @Post('auth/verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and get customer tokens' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() body: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.customersService.verifyOtp(body.email, body.otp);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/customers/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: result.accessToken };
  }

  @Post('auth/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh customer access token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const result = await this.customersService.refresh(refreshToken);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/customers/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: result.accessToken };
  }

  @Post('auth/logout')
  @UseGuards(CustomerJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout customer' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await this.customersService.logout(refreshToken);
    }

    res.clearCookie('refreshToken', {
      path: '/api/v1/customers/auth',
    });

    return { success: true };
  }

  @Get('me')
  @UseGuards(CustomerJwtAuthGuard)
  @ApiOperation({ summary: 'Get current customer profile' })
  async getProfile(@Req() req: any) {
    return this.customersService.getCustomerProfile(req.user.id);
  }

  @Get('me/orders')
  @UseGuards(CustomerJwtAuthGuard)
  @ApiOperation({ summary: 'Get current customer orders' })
  async getMyOrders(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.customersService.getCustomerOrders(req.user.id, pageNum, limitNum, status);
  }

  @Get('me/orders/:id')
  @UseGuards(CustomerJwtAuthGuard)
  @ApiOperation({ summary: 'Get specific customer order details' })
  async getMyOrderById(@Req() req: any, @Param('id') orderId: string) {
    return this.customersService.getCustomerOrderById(req.user.id, orderId);
  }
}
