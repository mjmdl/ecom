import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from './entities/user.entity';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {AuthModule} from '../auth/auth.module';
import {UserProfileView} from './views/user-profile.view';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserProfileView]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
