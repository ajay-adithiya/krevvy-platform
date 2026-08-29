import { Controller, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from '../product.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard/jwt-auth.guard';
import * as Repeatables from '../dto/product-repeatables.dto';

@ApiTags('Product Features and Specs')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('admin/products')
export class ProductRepeatablesController {
  constructor(private readonly productService: ProductService) {}

  // Features
  @Post('features')
  @ApiOperation({ summary: 'Add a product feature' })
  async createFeature(@Body() dto: Repeatables.CreateProductFeatureDto) {
    return this.productService.createFeature(dto);
  }

  @Put('features/:id')
  @ApiOperation({ summary: 'Update a product feature' })
  async updateFeature(@Param('id') id: string, @Body() dto: Repeatables.UpdateProductFeatureDto) {
    return this.productService.updateFeature(id, dto);
  }

  @Delete('features/:id')
  @ApiOperation({ summary: 'Delete a product feature' })
  async removeFeature(@Param('id') id: string) {
    return this.productService.removeFeature(id);
  }

  // Specifications
  @Post('specifications')
  @ApiOperation({ summary: 'Add a product specification' })
  async createSpecification(@Body() dto: Repeatables.CreateProductSpecificationDto) {
    return this.productService.createSpecification(dto);
  }

  @Put('specifications/:id')
  @ApiOperation({ summary: 'Update a product specification' })
  async updateSpecification(@Param('id') id: string, @Body() dto: Repeatables.UpdateProductSpecificationDto) {
    return this.productService.updateSpecification(id, dto);
  }

  @Delete('specifications/:id')
  @ApiOperation({ summary: 'Delete a product specification' })
  async removeSpecification(@Param('id') id: string) {
    return this.productService.removeSpecification(id);
  }
}
