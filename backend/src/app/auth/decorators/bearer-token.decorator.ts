import {ExecutionContext, createParamDecorator} from '@nestjs/common';

export const BearerToken = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const {authorization} = request.headers;
    const token = authorization?.split(' ')[1] ?? undefined;
    return token;
  },
);
