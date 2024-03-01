import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ENVIRONMENT_CONFIG } from './configs/environment.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { POSTGRES_CONFIG } from './configs/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot(ENVIRONMENT_CONFIG),
    TypeOrmModule.forRootAsync(POSTGRES_CONFIG),
  ],
})
export class AppModule {}
