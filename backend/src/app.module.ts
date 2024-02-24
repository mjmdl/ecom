import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ENVIRONMENT_CONFIG, TYPEORM_POSTGRES_CONFIG } from './app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot(ENVIRONMENT_CONFIG),
    TypeOrmModule.forRootAsync(TYPEORM_POSTGRES_CONFIG),

    AuthModule,
    RolesModule,
    UsersModule,
  ],
})
export class AppModule {}
