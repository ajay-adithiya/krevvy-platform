import { Module } from '@nestjs/common';
import { CmsService } from './services/cms.service';
import { ContentPublicController } from './controllers/content-public.controller';
import { ContentAdminController } from './controllers/content-admin.controller';
import { RepeatablesAdminController } from './controllers/repeatables-admin.controller';

@Module({
  controllers: [
    ContentPublicController,
    ContentAdminController,
    RepeatablesAdminController,
  ],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
