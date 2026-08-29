import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import * as Repeatables from './dto/product-repeatables.dto';

import { generateSlug } from '../common/utils/slug.util';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  private async validateCategory(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = generateSlug(name);

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { slug },
      });

      if (!existingProduct) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  async create(createProductDto: CreateProductDto) {
    await this.validateCategory(createProductDto.categoryId);

    const slug = await this.generateUniqueSlug(createProductDto.name);

    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        slug,
        shortDescription: createProductDto.shortDescription,
        description: createProductDto.description,
        price: createProductDto.price,
        amazonUrl: createProductDto.amazonUrl,
        isFeatured: createProductDto.isFeatured ?? false,
        isActive: createProductDto.isActive ?? true,
        categoryId: createProductDto.categoryId,
        stock: createProductDto.stock ?? 0,
        tagline: createProductDto.tagline,
        isNewArrival: createProductDto.isNewArrival,
        isBestSeller: createProductDto.isBestSeller,
        discountLabel: createProductDto.discountLabel,
        ratingDisplay: createProductDto.ratingDisplay,
        reviewCountDisplay: createProductDto.reviewCountDisplay,
        primaryColorAccent: createProductDto.primaryColorAccent,
        amazonButtonLabel: createProductDto.amazonButtonLabel,
      },
    });

    this.logger.log(
      `Product created successfully: ${product.name}`,
      ProductService.name,
    );

    return product;
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
        features: { orderBy: { displayOrder: 'asc' } },
        specifications: { orderBy: { displayOrder: 'asc' } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
        features: { orderBy: { displayOrder: 'asc' } },
        specifications: { orderBy: { displayOrder: 'asc' } },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    if (updateProductDto.categoryId) {
      await this.validateCategory(updateProductDto.categoryId);
    }

    const data: any = {
      ...updateProductDto,
    };

    if (updateProductDto.name) {
      data.slug = await this.generateUniqueSlug(updateProductDto.name);
    }

    const product = await this.prisma.product.update({
      where: { id },
      data,
    });

    this.logger.log(
      `Product updated successfully: ${product.name}`,
      ProductService.name,
    );

    return product;
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });

    this.logger.log(
      `Product deleted successfully: ${product.name}`,
      ProductService.name,
    );

    return {
      id: product.id,
      message: 'Product deleted successfully',
    };
  }

  // --- FEATURES ---
  async createFeature(dto: Repeatables.CreateProductFeatureDto) {
    return this.prisma.productFeature.create({ data: dto });
  }
  async updateFeature(id: string, dto: Repeatables.UpdateProductFeatureDto) {
    return this.prisma.productFeature.update({ where: { id }, data: dto });
  }
  async removeFeature(id: string) {
    return this.prisma.productFeature.delete({ where: { id } });
  }

  // --- SPECS ---
  async createSpecification(dto: Repeatables.CreateProductSpecificationDto) {
    return this.prisma.productSpecification.create({ data: dto });
  }
  async updateSpecification(id: string, dto: Repeatables.UpdateProductSpecificationDto) {
    return this.prisma.productSpecification.update({ where: { id }, data: dto });
  }
  async removeSpecification(id: string) {
    return this.prisma.productSpecification.delete({ where: { id } });
  }
}