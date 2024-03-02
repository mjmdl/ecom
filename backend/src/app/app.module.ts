import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {ENVIRONMENT_CONFIG} from './configs/environment.config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {POSTGRES_CONFIG} from './configs/typeorm.config';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {RoleModule} from './role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot(ENVIRONMENT_CONFIG),
    TypeOrmModule.forRootAsync(POSTGRES_CONFIG),
    AuthModule,
    RoleModule,
    UserModule,
  ],
})
export class AppModule {}
