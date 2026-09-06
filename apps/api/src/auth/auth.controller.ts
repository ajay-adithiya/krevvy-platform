import { ResponseMessage } from '../common/decorators/response-message.decorator';

import {
  Body,
  Controller,
  Post,
  Patch,
  Get,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-admin')
  @ResponseMessage('Admin registered successfully')
  @ApiOperation({ summary: 'Register a new admin account' })
  @ApiResponse({
      status: 201,
      description: 'Admin registered successfully.',
  })
  @ApiResponse({
      status: 400,
      description: 'Invalid request data.',
  })
  registerAdmin(@Body() registerDto: RegisterAdminDto) {
      return this.authService.registerAdmin(registerDto);
  }

  @Post('login')
  @ResponseMessage('Login successful')
  @ApiOperation({ summary: 'Login and receive JWT tokens' })
  @ApiResponse({
      status: 200,
      description: 'Login successful.',
  })
  @ApiResponse({
      status: 401,
      description: 'Invalid email or password.',
  })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
      const result = await this.authService.login(loginDto);

      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('adminRefreshToken', result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/api/v1/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        accessToken: result.accessToken,
      };
  }

  @Post('refresh')
  @ResponseMessage('Token refreshed successfully')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
      status: 200,
      description: 'Token refreshed successfully.',
  })
  @ApiResponse({
      status: 401,
      description: 'Invalid or expired refresh token.',
  })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
      const refreshToken = req.cookies?.adminRefreshToken;
      if (!refreshToken) {
        throw new UnauthorizedException('No refresh token provided');
      }

      const result = await this.authService.refresh(refreshToken);

      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('adminRefreshToken', result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/api/v1/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        accessToken: result.accessToken,
      };
  }

  @Post('logout')
  @ResponseMessage('Logout successful')
  @ApiOperation({ summary: 'Logout admin account' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.adminRefreshToken;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('adminRefreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/api/v1/auth',
    });

    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('access-token')
  @ResponseMessage('Profile fetched successfully')
  getProfile(@Req() req: any) {
      return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('email')
  @ApiBearerAuth('access-token')
  @ResponseMessage('Email updated successfully')
  @ApiOperation({ summary: 'Change admin email' })
  changeEmail(@Req() req: any, @Body() dto: ChangeEmailDto) {
    return this.authService.changeEmail(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  @ApiBearerAuth('access-token')
  @ResponseMessage('Password updated successfully')
  @ApiOperation({ summary: 'Change admin password' })
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto);
  }

  @Post('forgot-password')
  @ResponseMessage('Password reset email requested')
  @ApiOperation({ summary: 'Request a password reset email' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ResponseMessage('Password reset successfully')
  @ApiOperation({ summary: 'Reset password using token' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
