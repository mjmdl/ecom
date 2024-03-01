import { ValidationPipeOptions } from '@nestjs/common';

export const VALIDATION_CONFIG: ValidationPipeOptions = {
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  transform: true,
  whitelist: true,
};
