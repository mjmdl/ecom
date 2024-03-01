import { ConfigModuleOptions } from '@nestjs/config';
import { Transform, plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

class Environment {
  @IsNotEmpty()
  @IsNumber()
  @Transform((env: any) => +env.obj.APPLICATION_PORT)
  APPLICATION_PORT: number = 3000;

  @IsNotEmpty()
  @IsString()
  JSONWEBTOKEN_SECRET!: string;

  @IsNotEmpty()
  @IsString()
  JSONWEBTOKEN_EXPIRATION!: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform((env: any) => +env.obj.BCRYPT_ROUNDS_FOR_PASSWORD)
  BCRYPT_ROUNDS_FOR_PASSWORD!: number;

  @IsNotEmpty()
  @IsBoolean()
  @Transform((env: any) => env.obj.TYPEORM_SYNCHRONIZE_POSTGRES === 'true')
  TYPEORM_SYNCHRONIZE_POSTGRES!: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Transform((env: any) => +env.obj.POSTGRES_PORT)
  POSTGRES_PORT: number = 5432;

  @IsNotEmpty()
  @IsString()
  POSTGRES_HOST: string = 'localhost';

  @IsNotEmpty()
  @IsString()
  POSTGRES_USER: string = 'pguser';

  @IsNotEmpty()
  @IsString()
  POSTGRES_PASSWORD: string = 'pgpassword';

  @IsNotEmpty()
  @IsString()
  POSTGRES_DATABASE: string = 'ecom';
}

export const ENVIRONMENT_CONFIG: ConfigModuleOptions = {
  isGlobal: true,
  validate: (config: Record<string, any>): Record<string, any> => {
    const environment = plainToInstance(Environment, config);
    const errors = validateSync(environment);
    if (errors.length > 0) {
      throw new Error(`Invalid environment variables: '${errors.toString()}'`);
    }
    return environment;
  },
};
