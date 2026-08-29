import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from '../../common/logger/logger.service';
import * as Singletons from '../dto/singleton.dto';
import * as Repeatables from '../dto/repeatable.dto';

@Injectable()
export class CmsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  // --- PUBLIC READS ---
  async getGlobalContent() {
    const content = await this.prisma.globalSiteContent.findUnique({
      where: { id: 1 },
      include: {
        logoMedia: true,
        seoOgMedia: true,
        defaultAmazonProduct: true,
      },
    });
    const navigation = await this.prisma.navigationItem.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: 'asc' },
    });
    const footerGroups = await this.prisma.footerGroup.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        links: {
          where: { isVisible: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
    const amazonModalBenefits = await this.prisma.amazonModalBenefit.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: 'asc' },
    });
    return { content, navigation, footerGroups, amazonModalBenefits };
  }

  async getHomeContent() {
    return this.prisma.homePageContent.findUnique({
      where: { id: 1 },
      include: { heroMedia: true },
    });
  }

  async getProductsContent() {
    return this.prisma.productsPageContent.findUnique({
      where: { id: 1 },
    });
  }

  async getAboutContent() {
    const content = await this.prisma.aboutPageContent.findUnique({
      where: { id: 1 },
    });
    const pillars = await this.prisma.aboutPillar.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return { content, pillars };
  }

  async getContactContent() {
    const content = await this.prisma.contactPageContent.findUnique({
      where: { id: 1 },
    });
    const inquiryOptions = await this.prisma.contactInquiryOption.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: 'asc' },
    });
    return { content, inquiryOptions };
  }

  async getFaqContent() {
    const content = await this.prisma.faqPageContent.findUnique({
      where: { id: 1 },
    });
    const categories = await this.prisma.faqCategory.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        faqs: {
          where: { isVisible: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
    return { content, categories };
  }

  // --- ADMIN SINGLETON UPSERTS ---
  async upsertGlobalContent(dto: Singletons.UpdateGlobalSiteContentDto) {
    return this.prisma.globalSiteContent.upsert({
      where: { id: 1 },
      update: dto,
      create: dto,
    });
  }
  async upsertHomeContent(dto: Singletons.UpdateHomePageContentDto) {
    return this.prisma.homePageContent.upsert({
      where: { id: 1 },
      update: dto,
      create: dto,
    });
  }
  async upsertProductsContent(dto: Singletons.UpdateProductsPageContentDto) {
    return this.prisma.productsPageContent.upsert({
      where: { id: 1 },
      update: dto,
      create: dto,
    });
  }
  async upsertAboutContent(dto: Singletons.UpdateAboutPageContentDto) {
    return this.prisma.aboutPageContent.upsert({
      where: { id: 1 },
      update: dto,
      create: dto,
    });
  }
  async upsertContactContent(dto: Singletons.UpdateContactPageContentDto) {
    return this.prisma.contactPageContent.upsert({
      where: { id: 1 },
      update: dto,
      create: dto,
    });
  }
  async upsertFaqContent(dto: Singletons.UpdateFaqPageContentDto) {
    return this.prisma.faqPageContent.upsert({
      where: { id: 1 },
      update: dto,
      create: dto,
    });
  }

  // --- ADMIN REPEATABLE CRUD ---

  // Navigation
  async getNavigations() { return this.prisma.navigationItem.findMany({ orderBy: { displayOrder: 'asc' } }); }
  async createNavigation(dto: Repeatables.CreateNavigationItemDto) { return this.prisma.navigationItem.create({ data: dto }); }
  async updateNavigation(id: string, dto: Repeatables.UpdateNavigationItemDto) { return this.prisma.navigationItem.update({ where: { id }, data: dto }); }
  async deleteNavigation(id: string) { return this.prisma.navigationItem.delete({ where: { id } }); }

  // Footer Groups
  async getFooterGroups() { return this.prisma.footerGroup.findMany({ orderBy: { displayOrder: 'asc' }, include: { links: { orderBy: { displayOrder: 'asc' } } } }); }
  async createFooterGroup(dto: Repeatables.CreateFooterGroupDto) { return this.prisma.footerGroup.create({ data: dto }); }
  async updateFooterGroup(id: string, dto: Repeatables.UpdateFooterGroupDto) { return this.prisma.footerGroup.update({ where: { id }, data: dto }); }
  async deleteFooterGroup(id: string) { return this.prisma.footerGroup.delete({ where: { id } }); }

  // Footer Links
  async createFooterLink(dto: Repeatables.CreateFooterLinkDto) { return this.prisma.footerLink.create({ data: dto }); }
  async updateFooterLink(id: string, dto: Repeatables.UpdateFooterLinkDto) { return this.prisma.footerLink.update({ where: { id }, data: dto }); }
  async deleteFooterLink(id: string) { return this.prisma.footerLink.delete({ where: { id } }); }

  // FAQ Categories
  async getFaqCategories() { return this.prisma.faqCategory.findMany({ orderBy: { displayOrder: 'asc' }, include: { faqs: { orderBy: { displayOrder: 'asc' } } } }); }
  async createFaqCategory(dto: Repeatables.CreateFaqCategoryDto) { return this.prisma.faqCategory.create({ data: dto }); }
  async updateFaqCategory(id: string, dto: Repeatables.UpdateFaqCategoryDto) { return this.prisma.faqCategory.update({ where: { id }, data: dto }); }
  async deleteFaqCategory(id: string) { return this.prisma.faqCategory.delete({ where: { id } }); }

  // FAQ Items
  async createFaqItem(dto: Repeatables.CreateFaqItemDto) { return this.prisma.faqItem.create({ data: dto }); }
  async updateFaqItem(id: string, dto: Repeatables.UpdateFaqItemDto) { return this.prisma.faqItem.update({ where: { id }, data: dto }); }
  async deleteFaqItem(id: string) { return this.prisma.faqItem.delete({ where: { id } }); }

  // About Pillars
  async getAboutPillars() { return this.prisma.aboutPillar.findMany({ orderBy: { displayOrder: 'asc' } }); }
  async createAboutPillar(dto: Repeatables.CreateAboutPillarDto) { return this.prisma.aboutPillar.create({ data: dto }); }
  async updateAboutPillar(id: string, dto: Repeatables.UpdateAboutPillarDto) { return this.prisma.aboutPillar.update({ where: { id }, data: dto }); }
  async deleteAboutPillar(id: string) { return this.prisma.aboutPillar.delete({ where: { id } }); }

  // Media Asset
  async getMediaAssets() { return this.prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } }); }
  async createMediaAsset(dto: Repeatables.CreateMediaAssetDto) { return this.prisma.mediaAsset.create({ data: dto }); }
  async updateMediaAsset(id: string, dto: Repeatables.UpdateMediaAssetDto) { return this.prisma.mediaAsset.update({ where: { id }, data: dto }); }
  async deleteMediaAsset(id: string) { return this.prisma.mediaAsset.delete({ where: { id } }); }

  // Contact Inquiry Options
  async getContactInquiryOptions() { return this.prisma.contactInquiryOption.findMany({ orderBy: { displayOrder: 'asc' } }); }
  async createContactInquiryOption(dto: Repeatables.CreateContactInquiryOptionDto) { return this.prisma.contactInquiryOption.create({ data: dto }); }
  async updateContactInquiryOption(id: string, dto: Repeatables.UpdateContactInquiryOptionDto) { return this.prisma.contactInquiryOption.update({ where: { id }, data: dto }); }
  async deleteContactInquiryOption(id: string) { return this.prisma.contactInquiryOption.delete({ where: { id } }); }

  // Amazon Modal Benefits
  async getAmazonModalBenefits() { return this.prisma.amazonModalBenefit.findMany({ orderBy: { displayOrder: 'asc' } }); }
  async createAmazonModalBenefit(dto: Repeatables.CreateAmazonModalBenefitDto) { return this.prisma.amazonModalBenefit.create({ data: dto }); }
  async updateAmazonModalBenefit(id: string, dto: Repeatables.UpdateAmazonModalBenefitDto) { return this.prisma.amazonModalBenefit.update({ where: { id }, data: dto }); }
  async deleteAmazonModalBenefit(id: string) { return this.prisma.amazonModalBenefit.delete({ where: { id } }); }
}
