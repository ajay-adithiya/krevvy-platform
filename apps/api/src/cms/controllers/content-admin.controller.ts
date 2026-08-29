import { Controller, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CmsService } from '../services/cms.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard/jwt-auth.guard';
import * as Singletons from '../dto/singleton.dto';

@ApiTags('CMS Admin Content (Singletons)')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('admin/content')
export class ContentAdminController {
  constructor(private readonly cmsService: CmsService) {}

  @Put('global')
  @ApiOperation({ summary: 'Upsert global site content' })
  async upsertGlobalContent(@Body() dto: Singletons.UpdateGlobalSiteContentDto) {
    return this.cmsService.upsertGlobalContent(dto);
  }

  @Put('home')
  @ApiOperation({ summary: 'Upsert home page content' })
  async upsertHomeContent(@Body() dto: Singletons.UpdateHomePageContentDto) {
    return this.cmsService.upsertHomeContent(dto);
  }

  @Put('products')
  @ApiOperation({ summary: 'Upsert products page content' })
  async upsertProductsContent(@Body() dto: Singletons.UpdateProductsPageContentDto) {
    return this.cmsService.upsertProductsContent(dto);
  }

  @Put('about')
  @ApiOperation({ summary: 'Upsert about page content' })
  async upsertAboutContent(@Body() dto: Singletons.UpdateAboutPageContentDto) {
    return this.cmsService.upsertAboutContent(dto);
  }

  @Put('contact')
  @ApiOperation({ summary: 'Upsert contact page content' })
  async upsertContactContent(@Body() dto: Singletons.UpdateContactPageContentDto) {
    return this.cmsService.upsertContactContent(dto);
  }

  @Put('faq')
  @ApiOperation({ summary: 'Upsert FAQ page content' })
  async upsertFaqContent(@Body() dto: Singletons.UpdateFaqPageContentDto) {
    return this.cmsService.upsertFaqContent(dto);
  }
}
