import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ProductFeature
export class CreateProductFeatureDto {
  @ApiProperty() @IsString() productId: string;
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
}
export class UpdateProductFeatureDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
}

// ProductSpecification
export class CreateProductSpecificationDto {
  @ApiProperty() @IsString() productId: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() value: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
}
export class UpdateProductSpecificationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() value?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
}
