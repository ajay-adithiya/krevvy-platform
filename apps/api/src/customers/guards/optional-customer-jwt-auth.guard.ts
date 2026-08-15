import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalCustomerJwtAuthGuard extends AuthGuard('customer-jwt') {
  handleRequest(err, user, info) {
    // If no user is found, just return null instead of throwing an error
    // This allows guest checkout to proceed without a JWT
    return user || null;
  }
}
