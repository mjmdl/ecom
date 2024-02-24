import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity, RoleEnum } from './roles.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, UserEntity]), AuthModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {
  constructor(
    @InjectRepository(RoleEntity)
    rolesRepository: Repository<RoleEntity>,
  ) {
    this.updateRoles(rolesRepository);
  }

  async updateRoles(rolesRepository: Repository<RoleEntity>): Promise<void> {
    const roleNames = Object.values(RoleEnum);

    for (const name of roleNames) {
      const roleExist = await rolesRepository
        .exists({ where: { name } })
        .catch((error) => {
          throw new Error(`Error verifying if role exist: ${error}`);
        });
      if (roleExist) {
        continue;
      }

      const newRole = rolesRepository.create({ name });
      await rolesRepository.insert(newRole).catch((error) => {
        throw new Error(`Error while inserting role ${name}: ${error}`);
      });

      console.log(`Inserted role ${name}`);
    }
  }
}
