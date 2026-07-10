import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@krevvy.com',
    description: 'Registered administrator email',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Admin@123',
    description: 'Administrator password',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
}