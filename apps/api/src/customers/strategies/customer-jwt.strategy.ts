import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CustomerJwtStrategy extends PassportStrategy(Strategy, 'customer-jwt') {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_CUSTOMER_SECRET'),
    });
  }

  async validate(payload: any) {
    if (payload.type !== 'customer') {
      throw new UnauthorizedException('Invalid token type');
    }

    // Optional: Check if customer still exists in the database
    // This adds a DB call but ensures revoked/deleted accounts can't use valid tokens
    const customer = await this.prisma.customer.findUnique({
      where: { id: payload.sub }
    });

    if (!customer) {
      throw new UnauthorizedException('Customer not found');
    }

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
