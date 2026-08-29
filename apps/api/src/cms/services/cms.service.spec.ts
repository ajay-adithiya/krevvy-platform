import { Test, TestingModule } from '@nestjs/testing';
import { CmsService } from './cms.service';
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from '../../common/logger/logger.service';

describe('CmsService', () => {
  let service: CmsService;
  let prisma: PrismaService;

  const mockPrisma = {
    globalSiteContent: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    navigationItem: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    footerGroup: {
      findMany: jest.fn(),
    },
    faqPageContent: {
      findUnique: jest.fn(),
    },
    faqCategory: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CmsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: LoggerService, useValue: { log: jest.fn() } },
      ],
    }).compile();

    service = module.get<CmsService>(CmsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Public GET operations', () => {
    it('getGlobalContent should filter visible items and order them', async () => {
      mockPrisma.globalSiteContent.findUnique.mockResolvedValue({ id: 1, copyrightText: '2026' });
      mockPrisma.navigationItem.findMany.mockResolvedValue([{ id: 'nav1', isVisible: true, displayOrder: 1 }]);
      mockPrisma.footerGroup.findMany.mockResolvedValue([]);

      const result = await service.getGlobalContent();

      expect(prisma.navigationItem.findMany).toHaveBeenCalledWith({
        where: { isVisible: true },
        orderBy: { displayOrder: 'asc' },
      });
      expect(result.content.copyrightText).toEqual('2026');
      expect(result.navigation.length).toEqual(1);
    });

    it('getFaqContent should return visible categories and faqs ordered', async () => {
      mockPrisma.faqPageContent.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.faqCategory.findMany.mockResolvedValue([]);

      await service.getFaqContent();

      expect(prisma.faqCategory.findMany).toHaveBeenCalledWith({
        where: { isVisible: true },
        orderBy: { displayOrder: 'asc' },
        include: {
          faqs: {
            where: { isVisible: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });
    });
  });

  describe('Singleton upserts', () => {
    it('should always use id 1 to prevent duplicates', async () => {
      await service.upsertGlobalContent({ copyrightText: 'Test' });
      expect(prisma.globalSiteContent.upsert).toHaveBeenCalledWith({
        where: { id: 1 },
        update: { copyrightText: 'Test' },
        create: { copyrightText: 'Test' },
      });
    });
  });
});
