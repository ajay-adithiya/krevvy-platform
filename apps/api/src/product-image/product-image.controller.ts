import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { ProductImageService } from './product-image.service';

import { UpdateProductImageDto } from './dto/update-product-image.dto';

import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
@ApiTags('Product Images')

@Controller('products/:productId/images')
export class ProductImageController {
  constructor(
    private readonly productImageService: ProductImageService,
  ) {}

  @ApiConsumes('multipart/form-data')
    @ApiBody({
    schema: {
        type: 'object',
        properties: {
        image: {
            type: 'string',
            format: 'binary',
        },
        },
    },
    })

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @Param('productId') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productImageService.uploadImage(
      productId,
      file,
    );
  }

  @Get()
  findByProduct(@Param('productId') productId: string) {
    return this.productImageService.findByProduct(productId);
  }

  @Patch(':id')
  updateImage(
    @Param('id') id: string,
    @Body() dto: UpdateProductImageDto,
  ) {
    return this.productImageService.updateImage(id, dto);
  }

  @Patch(':id/primary')
  setPrimary(@Param('id') id: string) {
    return this.productImageService.setPrimary(id);
  }

  @Delete(':id')
  deleteImage(@Param('id') id: string) {
    return this.productImageService.deleteImage(id);
  }

}