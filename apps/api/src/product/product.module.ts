import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepeatablesController } from './controllers/product-repeatables.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProductService],
  controllers: [ProductController, ProductRepeatablesController]
})
export class ProductModule {}
