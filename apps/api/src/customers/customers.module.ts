import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { EmailService } from './email.service';
import { CustomerJwtStrategy } from './strategies/customer-jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      // We purposefully do not set a default secret here,
      // as we explicitly pass the secret in signAsync options
      // to ensure separation of concerns.
    }),
  ],
  controllers: [CustomersController],
  providers: [CustomersService, EmailService, CustomerJwtStrategy],
  exports: [CustomersService, CustomerJwtStrategy, PassportModule],
})
export class CustomersModule {}
