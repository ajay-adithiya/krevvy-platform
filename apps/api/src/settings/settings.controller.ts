import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard/jwt-auth.guard';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post()
  @ResponseMessage('Setting created successfully')
  create(@Body() dto: CreateSettingDto) {
    return this.settingsService.create(dto);
  }

  @Get()
  @ResponseMessage('Settings fetched successfully')
  findAll() {
    return this.settingsService.findAll();
  }

  @Get(':key')
  @ResponseMessage('Setting fetched successfully')
  findOne(@Param('key') key: string) {
    return this.settingsService.findOne(key);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Patch(':key')
  @ResponseMessage('Setting updated successfully')
  update(
    @Param('key') key: string,
    @Body() dto: UpdateSettingDto,
  ) {
    return this.settingsService.update(key, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Delete(':key')
  @ResponseMessage('Setting deleted successfully')
  remove(@Param('key') key: string) {
    return this.settingsService.remove(key);
  }
}