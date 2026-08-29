import { Test, TestingModule } from '@nestjs/testing';
import { ContentPublicController } from './content-public.controller';
import { CmsService } from '../services/cms.service';

describe('ContentPublicController', () => {
  let controller: ContentPublicController;
  let cmsService: CmsService;

  const mockCmsService = {
    getGlobalContent: jest.fn(),
    getFaqContent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentPublicController],
      providers: [
        { provide: CmsService, useValue: mockCmsService },
      ],
    }).compile();

    controller = module.get<ContentPublicController>(ContentPublicController);
    cmsService = module.get<CmsService>(CmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getGlobalContent', async () => {
    await controller.getGlobalContent();
    expect(cmsService.getGlobalContent).toHaveBeenCalled();
  });

  it('should call getFaqContent', async () => {
    await controller.getFaqContent();
    expect(cmsService.getFaqContent).toHaveBeenCalled();
  });
});
