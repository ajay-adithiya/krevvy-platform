import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class CreateSettingDto {
  @ApiProperty({
    example: 'homepage',
  })
  @IsString()
  key!: string;

  @ApiProperty({
    example: {
      heroTitle: 'Welcome to Krevvy',
      heroSubtitle: 'Premium Products',
    },
  })
  @IsObject()
  value!: Record<string, any>;
}