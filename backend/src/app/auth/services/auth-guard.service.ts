import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PayloadDto} from '../dtos/payload.dto';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuardService {
  constructor(private readonly authService: AuthService) {}

  async extractBearerToken(authorization: string): Promise<PayloadDto> {
    const [type, token] = authorization.split(' ') ?? [];
    if (!type || !token || type.toLowerCase() != 'bearer') {
      throw new UnauthorizedException('Bearer token is not provided.');
    }

    await this.authService.validateBearerToken(token);

    const payloadDto = await this.authService
      .getTokenPayload(token)
      .catch((error) => {
        throw new UnauthorizedException('Invalid bearer token.');
      });
    return payloadDto;
  }
}
