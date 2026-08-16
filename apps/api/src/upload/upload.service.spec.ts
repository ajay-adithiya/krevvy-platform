import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { LoggerService } from '../common/logger/logger.service';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: CloudinaryService, useValue: {} },
        { provide: LoggerService, useValue: {} },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
