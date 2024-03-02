import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {AuthGuardService} from '../services/auth-guard.service';

@Injectable()
export class AuthGuard implements CanActivate {
  static readonly USER_KEY: string = 'currentUser';
  constructor(private readonly authService: AuthGuardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const {authorization} = request.headers;

    const payloadDto = await this.authService.extractBearerToken(authorization);
    request[AuthGuard.USER_KEY] = payloadDto;

    return true;
  }
}
