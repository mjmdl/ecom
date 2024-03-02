import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RoleEntity} from './entities/role.entity';
import {RolesUpdaterService} from './services/roles-updater.service';
import {RoleService} from './services/role.service';
import {RoleController} from './role.controller';
import {AuthModule} from '../auth/auth.module';
import {RoleGuard} from './guards/role.guard';
import {UserEntity} from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, UserEntity]), AuthModule],
  controllers: [RoleController],
  providers: [RolesUpdaterService, RoleService, RoleGuard],
})
export class RoleModule {}
