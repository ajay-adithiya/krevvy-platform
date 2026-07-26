import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UploadProductImageDto {
  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}