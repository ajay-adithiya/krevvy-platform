import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeEmailDto {
  @ApiProperty({ example: 'new-admin@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  newEmail: string;

  @ApiProperty({ example: 'currentPassword123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  currentPassword: string;
}
