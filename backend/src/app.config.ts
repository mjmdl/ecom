import { ValidationPipeOptions } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsNumber, IsOptional, validateSync } from 'class-validator';

class Environment {
  @IsOptional()
  @IsNumber()
  BACKEND_PORT: number = 3001;
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
