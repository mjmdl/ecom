import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
  createParamDecorator,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './auth.dto';
import { Request } from 'express';
import { UUID } from 'crypto';

@Injectable()
export class AuthGuard implements CanActivate {
  static readonly USER_KEY = 'currentUser';

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    if (!authorization) {
      throw new UnauthorizedException('Token is not provided.');
    }

    const payloadDto = await this.authService.extractBearerToken(authorization);
    const userContext = await this.authService.getUserContext(
      payloadDto.userId,
    );
    request[AuthGuard.USER_KEY] = userContext;

    return true;
  }
}

export function RequireAuth(): MethodDecorator & ClassDecorator {
  return UseGuards(AuthGuard);
}

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext): CurrentUser => {
    const request = context.switchToHttp().getRequest();
    return request[AuthGuard.USER_KEY] as CurrentUser;
  },
);

export const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): UUID => {
    const request = context.switchToHttp().getRequest();
    const payloadDto = request[AuthGuard.USER_KEY] as CurrentUser;
    return payloadDto.id;
  },
);
