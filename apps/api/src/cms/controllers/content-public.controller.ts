import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CmsService } from '../services/cms.service';

@ApiTags('CMS Public Content')
@Controller('content')
export class ContentPublicController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('global')
  @ApiOperation({ summary: 'Get global site content, navigation, and footer' })
  async getGlobalContent() {
    return this.cmsService.getGlobalContent();
  }

  @Get('home')
  @ApiOperation({ summary: 'Get home page content' })
  async getHomeContent() {
    return this.cmsService.getHomeContent();
  }

  @Get('products')
  @ApiOperation({ summary: 'Get products page content' })
  async getProductsContent() {
    return this.cmsService.getProductsContent();
  }

  @Get('about')
  @ApiOperation({ summary: 'Get about page content and pillars' })
  async getAboutContent() {
    return this.cmsService.getAboutContent();
  }

  @Get('contact')
  @ApiOperation({ summary: 'Get contact page content' })
  async getContactContent() {
    return this.cmsService.getContactContent();
  }

  @Get('faq')
  @ApiOperation({ summary: 'Get FAQ page content and items' })
  async getFaqContent() {
    return this.cmsService.getFaqContent();
  }
}
