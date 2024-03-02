import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TokenEntity} from './entities/token.entity';
import {AuthController} from './auth.controller';
import {AuthService} from './services/auth.service';
import {UserEntity} from '../user/entities/user.entity';
import {JwtModule} from '@nestjs/jwt';
import {JWT_CONFIG} from './configs/jwt.config';
import {AuthGuard} from './guards/auth.guard';
import {AuthGuardService} from './services/auth-guard.service';
import {ExpireTokenService} from './services/expire-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenEntity, UserEntity]),
    JwtModule.registerAsync(JWT_CONFIG),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuardService, AuthGuard, ExpireTokenService],
  exports: [AuthGuardService],
})
export class AuthModule {}
