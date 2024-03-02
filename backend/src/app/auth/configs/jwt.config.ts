import {ConfigService} from '@nestjs/config';
import {JwtModuleAsyncOptions, JwtModuleOptions} from '@nestjs/jwt';

export const JWT_CONFIG: JwtModuleAsyncOptions = {
  global: false,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): JwtModuleOptions => ({
    global: false,
    secret: configService.getOrThrow<string>('JSONWEBTOKEN_SECRET'),
    signOptions: {
      expiresIn: configService.getOrThrow<string>('JSONWEBTOKEN_EXPIRATION'),
    },
  }),
};
