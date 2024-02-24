import { ValidationPipeOptions } from '@nestjs/common';
import { ConfigModuleOptions, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsNumberString,
  IsString,
  validateSync,
} from 'class-validator';

class Environment {
  @IsNumber()
  BACKEND_PORT: number = 3001;

  @IsString()
  TYPEORM_SYNCHRONIZE_POSTGRES: string = 'false';

  @IsString()
  POSTGRES_HOST: string = 'localhost';

  @IsNumberString()
  POSTGRES_PORT: number = 3002;

  @IsString()
  POSTGRES_USER: string = 'pguser';

  @IsString()
  POSTGRES_PASSWORD: string = 'pgpassword';

  @IsString()
  POSTGRES_DATABASE: string = 'ecom';
}

export const VALIDATION_PIPE_CONFIG: ValidationPipeOptions = {
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  whitelist: true,
};

export const ENVIRONMENT_CONFIG: ConfigModuleOptions = {
  isGlobal: true,
  validate: (config: Record<string, any>): Record<string, any> => {
    const environment = plainToInstance(Environment, config, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(environment, {
      skipMissingProperties: true,
    });
    if (errors && errors.length > 0) {
      throw new Error(errors.toString());
    }

    return environment;
  },
};

export const TYPEORM_POSTGRES_CONFIG: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('POSTGRES_HOST'),
    port: configService.get<number>('POSTGRES_PORT'),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database: configService.get<string>('POSTGRES_DATABASE'),
    synchronize:
      configService.get<string>('TYPEORM_SYNCHRONIZE_POSTGRES') === 'true',
    autoLoadEntities: true,
  }),
};
