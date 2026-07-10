import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterAdminDto {
  @ApiProperty({
    example: 'admin@krevvy.com',
    description: 'Administrator email address',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Admin@123',
    description: 'Administrator password (minimum 8 characters)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password!: string;
}