import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ENVIRONMENT_CONFIG } from './app.config';

@Module({
  imports: [ConfigModule.forRoot(ENVIRONMENT_CONFIG)],
})
export class AppModule {}
