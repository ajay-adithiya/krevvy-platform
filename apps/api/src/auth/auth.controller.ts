import { ResponseMessage } from '../common/decorators/response-message.decorator';

import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login.dto';
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
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth('access-token')
    @ResponseMessage('Profile fetched successfully')
    @ApiOperation({ summary: 'Get logged-in user profile' })
    @ApiResponse({
        status: 200,
        description: 'Authenticated user profile.',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    getProfile(@Req() req: any) {
        return req.user;
    }
}