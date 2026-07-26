import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@Injectable()
export class ProductImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadImage(
    productId: string,
    file: Express.Multer.File,
    ) {
    const product = await this.prisma.product.findUnique({
        where: {
        id: productId,
        },
    });

    if (!product) {
        throw new NotFoundException('Product not found');
    }

    const uploadedImage = await this.cloudinaryService.uploadImage(file);

    const image = await this.prisma.productImage.create({
        data: {
        productId,
        imageUrl: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
        altText: product.name,
        isPrimary: false,
        displayOrder: 0,
        },
    });

    return image;
  }

  async findByProduct(productId: string) {
    return this.prisma.productImage.findMany({
        where: {
        productId,
        },
        orderBy: {
        displayOrder: 'asc',    
        },
    });
  }

  async updateImage(
    id: string,
    dto: UpdateProductImageDto,
    ) {
    return this.prisma.productImage.update({
        where: { id },
        data: dto,
    });
  }

  async setPrimary(id: string) {
    const image = await this.prisma.productImage.findUnique({
        where: { id },
    });

    if (!image) {
        throw new NotFoundException('Image not found');
    }

    await this.prisma.productImage.updateMany({
        where: {
        productId: image.productId,
        },
        data: {
        isPrimary: false,
        },
    });

    return this.prisma.productImage.update({
        where: { id },
        data: {
        isPrimary: true,
        },
    });
  }

  async deleteImage(id: string) {
    const image = await this.prisma.productImage.findUnique({
        where: { id },
    });

    if (!image) {
        throw new NotFoundException('Image not found');
    }

    await this.cloudinaryService.deleteImage(image.publicId);

    await this.prisma.productImage.delete({
        where: { id },
    });

    return {
        message: 'Image deleted successfully',
    };
  }
}