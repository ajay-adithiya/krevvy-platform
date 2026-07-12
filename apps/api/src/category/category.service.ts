import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { generateSlug } from '../common/utils/slug.util';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = generateSlug(name);

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingCategory =
        await this.prisma.category.findUnique({
          where: { slug },
        });

      if (!existingCategory) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const slug = await this.generateUniqueSlug(
      createCategoryDto.name,
    );

    const category = await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        slug,
        description: createCategoryDto.description,
        isActive: createCategoryDto.isActive ?? true,
      },
    });

    this.logger.log(
      `Category created successfully: ${category.name}`,
      CategoryService.name,
    );

    return category;
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.findOne(id);

    const data: any = {
      ...updateCategoryDto,
    };

    if (updateCategoryDto.name) {
      data.slug = await this.generateUniqueSlug(
        updateCategoryDto.name,
      );
    }

    const category = await this.prisma.category.update({
      where: { id },
      data,
    });

    this.logger.log(
      `Category updated successfully: ${category.name}`,
      CategoryService.name,
    );

    return category;
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    await this.prisma.category.delete({
      where: { id },
    });

    this.logger.log(
      `Category deleted successfully: ${category.name}`,
      CategoryService.name,
    );

    return {
      id: category.id,
      message: 'Category deleted successfully',
    };
  }
}