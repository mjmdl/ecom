import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
  createParamDecorator,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PayloadDto } from './auth.dto';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  static readonly PAYLOAD_KEY = 'payload';

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    if (!authorization) {
      throw new UnauthorizedException('Token is not provided.');
    }

    const payloadDto = await this.authService.extractBearerToken(authorization);
    request[AuthGuard.PAYLOAD_KEY] = payloadDto;

    return true;
  }
}

export function RequireAuth(): MethodDecorator & ClassDecorator {
  return UseGuards(AuthGuard);
}

export const Payload = createParamDecorator(
  (data: unknown, context: ExecutionContext): PayloadDto => {
    const request = context.switchToHttp().getRequest();
    return request[AuthGuard.PAYLOAD_KEY] as PayloadDto;
  },
);
