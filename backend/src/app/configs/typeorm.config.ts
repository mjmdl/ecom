import {ConfigService} from '@nestjs/config';
import {TypeOrmModuleAsyncOptions, TypeOrmModuleOptions} from '@nestjs/typeorm';

export const POSTGRES_CONFIG: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.getOrThrow<string>('POSTGRES_HOST'),
    port: configService.getOrThrow<number>('POSTGRES_PORT'),
    username: configService.getOrThrow<string>('POSTGRES_USER'),
    password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
    database: configService.getOrThrow<string>('POSTGRES_DATABASE'),
    synchronize: configService.getOrThrow<boolean>(
      'TYPEORM_SYNCHRONIZE_POSTGRES',
    ),
    autoLoadEntities: true,
  }),
};
