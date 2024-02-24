import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const JWT_CONFIG: JwtModuleAsyncOptions = {
  global: false,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    global: false,
    secret: configService.get<string>('JSONWEBTOKEN_SECRET'),
    signOptions: {
      expiresIn: configService.get<string>('JSONWEBTOKEN_EXPIRATION'),
    },
  }),
};
