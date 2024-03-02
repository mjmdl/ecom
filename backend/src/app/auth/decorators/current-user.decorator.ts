import {ExecutionContext, createParamDecorator} from '@nestjs/common';
import {PayloadDto} from '../dtos/payload.dto';
import {AuthGuard} from '../guards/auth.guard';

export type CurrentUserDto = PayloadDto;

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): CurrentUserDto => {
    const request = context.switchToHttp().getRequest();
    return request[AuthGuard.USER_KEY];
  },
);
