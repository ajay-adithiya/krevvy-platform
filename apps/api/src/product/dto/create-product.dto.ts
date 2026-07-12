import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Grass Sickle Cutter Head',
    description: 'Product name',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'Heavy-duty grass cutter',
    required: false,
  })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({
    example: 'Heavy-duty grass cutter suitable for agriculture.',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    example: 499.99,
    description: 'Product price',
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  price!: number;

  @ApiProperty({
    example: 'https://amazon.in/your-product',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  amazonUrl?: string;

  @ApiProperty({
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: 'category_id_here',
    description: 'Category ID',
  })
  @IsString()
  categoryId!: string;
}