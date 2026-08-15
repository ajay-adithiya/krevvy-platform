import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestOtpDto {
  @ApiProperty({ example: 'customer@example.com', description: 'Customer email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
