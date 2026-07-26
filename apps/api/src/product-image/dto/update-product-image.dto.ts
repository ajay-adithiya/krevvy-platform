import { PartialType } from '@nestjs/mapped-types';
import { UploadProductImageDto } from './upload-product-image.dto';

export class UpdateProductImageDto extends PartialType(
  UploadProductImageDto,
) {}