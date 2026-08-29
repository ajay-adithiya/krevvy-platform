import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CmsService } from '../services/cms.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard/jwt-auth.guard';
import * as Repeatables from '../dto/repeatable.dto';

@ApiTags('CMS Admin Content (Repeatables)')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class RepeatablesAdminController {
  constructor(private readonly cmsService: CmsService) {}

  // Navigation
  @Get('navigation')
  async getNavigations() { return this.cmsService.getNavigations(); }
  @Post('navigation')
  async createNavigation(@Body() dto: Repeatables.CreateNavigationItemDto) { return this.cmsService.createNavigation(dto); }
  @Put('navigation/:id')
  async updateNavigation(@Param('id') id: string, @Body() dto: Repeatables.UpdateNavigationItemDto) { return this.cmsService.updateNavigation(id, dto); }
  @Delete('navigation/:id')
  async deleteNavigation(@Param('id') id: string) { return this.cmsService.deleteNavigation(id); }

  // Footer Groups
  @Get('footer/groups')
  async getFooterGroups() { return this.cmsService.getFooterGroups(); }
  @Post('footer/groups')
  async createFooterGroup(@Body() dto: Repeatables.CreateFooterGroupDto) { return this.cmsService.createFooterGroup(dto); }
  @Put('footer/groups/:id')
  async updateFooterGroup(@Param('id') id: string, @Body() dto: Repeatables.UpdateFooterGroupDto) { return this.cmsService.updateFooterGroup(id, dto); }
  @Delete('footer/groups/:id')
  async deleteFooterGroup(@Param('id') id: string) { return this.cmsService.deleteFooterGroup(id); }

  // Footer Links
  @Post('footer/links')
  async createFooterLink(@Body() dto: Repeatables.CreateFooterLinkDto) { return this.cmsService.createFooterLink(dto); }
  @Put('footer/links/:id')
  async updateFooterLink(@Param('id') id: string, @Body() dto: Repeatables.UpdateFooterLinkDto) { return this.cmsService.updateFooterLink(id, dto); }
  @Delete('footer/links/:id')
  async deleteFooterLink(@Param('id') id: string) { return this.cmsService.deleteFooterLink(id); }

  // FAQ Categories
  @Get('faqs/categories')
  async getFaqCategories() { return this.cmsService.getFaqCategories(); }
  @Post('faqs/categories')
  async createFaqCategory(@Body() dto: Repeatables.CreateFaqCategoryDto) { return this.cmsService.createFaqCategory(dto); }
  @Put('faqs/categories/:id')
  async updateFaqCategory(@Param('id') id: string, @Body() dto: Repeatables.UpdateFaqCategoryDto) { return this.cmsService.updateFaqCategory(id, dto); }
  @Delete('faqs/categories/:id')
  async deleteFaqCategory(@Param('id') id: string) { return this.cmsService.deleteFaqCategory(id); }

  // FAQ Items
  @Post('faqs/items')
  async createFaqItem(@Body() dto: Repeatables.CreateFaqItemDto) { return this.cmsService.createFaqItem(dto); }
  @Put('faqs/items/:id')
  async updateFaqItem(@Param('id') id: string, @Body() dto: Repeatables.UpdateFaqItemDto) { return this.cmsService.updateFaqItem(id, dto); }
  @Delete('faqs/items/:id')
  async deleteFaqItem(@Param('id') id: string) { return this.cmsService.deleteFaqItem(id); }

  // About Pillars
  @Get('about/pillars')
  async getAboutPillars() { return this.cmsService.getAboutPillars(); }
  @Post('about/pillars')
  async createAboutPillar(@Body() dto: Repeatables.CreateAboutPillarDto) { return this.cmsService.createAboutPillar(dto); }
  @Put('about/pillars/:id')
  async updateAboutPillar(@Param('id') id: string, @Body() dto: Repeatables.UpdateAboutPillarDto) { return this.cmsService.updateAboutPillar(id, dto); }
  @Delete('about/pillars/:id')
  async deleteAboutPillar(@Param('id') id: string) { return this.cmsService.deleteAboutPillar(id); }

  // Media Asset
  @Get('media')
  async getMediaAssets() { return this.cmsService.getMediaAssets(); }
  @Post('media')
  async createMediaAsset(@Body() dto: Repeatables.CreateMediaAssetDto) { return this.cmsService.createMediaAsset(dto); }
  @Put('media/:id')
  async updateMediaAsset(@Param('id') id: string, @Body() dto: Repeatables.UpdateMediaAssetDto) { return this.cmsService.updateMediaAsset(id, dto); }
  @Delete('media/:id')
  async deleteMediaAsset(@Param('id') id: string) { return this.cmsService.deleteMediaAsset(id); }

  // Contact Inquiry Options
  @Get('contact/inquiry-options')
  async getContactInquiryOptions() { return this.cmsService.getContactInquiryOptions(); }
  @Post('contact/inquiry-options')
  async createContactInquiryOption(@Body() dto: Repeatables.CreateContactInquiryOptionDto) { return this.cmsService.createContactInquiryOption(dto); }
  @Put('contact/inquiry-options/:id')
  async updateContactInquiryOption(@Param('id') id: string, @Body() dto: Repeatables.UpdateContactInquiryOptionDto) { return this.cmsService.updateContactInquiryOption(id, dto); }
  @Delete('contact/inquiry-options/:id')
  async deleteContactInquiryOption(@Param('id') id: string) { return this.cmsService.deleteContactInquiryOption(id); }

  // Amazon Modal Benefits
  @Get('amazon-modal-benefits')
  async getAmazonModalBenefits() { return this.cmsService.getAmazonModalBenefits(); }
  @Post('amazon-modal-benefits')
  async createAmazonModalBenefit(@Body() dto: Repeatables.CreateAmazonModalBenefitDto) { return this.cmsService.createAmazonModalBenefit(dto); }
  @Put('amazon-modal-benefits/:id')
  async updateAmazonModalBenefit(@Param('id') id: string, @Body() dto: Repeatables.UpdateAmazonModalBenefitDto) { return this.cmsService.updateAmazonModalBenefit(id, dto); }
  @Delete('amazon-modal-benefits/:id')
  async deleteAmazonModalBenefit(@Param('id') id: string) { return this.cmsService.deleteAmazonModalBenefit(id); }
}
