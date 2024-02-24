import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ENVIRONMENT_CONFIG, TYPEORM_POSTGRES_CONFIG } from './app.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(ENVIRONMENT_CONFIG),
    TypeOrmModule.forRootAsync(TYPEORM_POSTGRES_CONFIG),
  ],
})
export class AppModule {}
