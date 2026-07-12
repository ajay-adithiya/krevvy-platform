import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';

import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  create(dto: CreateSettingDto) {
    return this.prisma.setting.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.setting.findMany();
  }

  async findOne(key: string) {
    const setting = await this.prisma.setting.findUnique({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException('Setting not found');
    }

    return setting;
  }

  async update(key: string, dto: UpdateSettingDto) {
    await this.findOne(key);

    return this.prisma.setting.update({
      where: { key },
      data: dto,
    });
  }

  async remove(key: string) {
    await this.findOne(key);

    return this.prisma.setting.delete({
      where: { key },
    });
  }
}