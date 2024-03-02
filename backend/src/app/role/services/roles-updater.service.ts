import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {RoleEntity} from '../entities/role.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Role} from '../types/role.enum';

@Injectable()
export class RolesUpdaterService {
  constructor(
    @InjectRepository(RoleEntity)
    roleRepository: Repository<RoleEntity>,
  ) {
    this.updateRoles(roleRepository);
  }

  private async updateRoles(repository: Repository<RoleEntity>): Promise<void> {
    const roleNames = Object.values(Role);

    for (const name of roleNames) {
      const roleExist = await repository
        .exists({where: {name}})
        .catch((error) => {
          throw new Error(`Failed to validate if role exist: ${error}`);
        });
      if (roleExist) {
        continue;
      }

      const newRole = repository.create({name});
      await repository
        .save(newRole)
        .then((createdRole) => {
          console.log(`New role created: ${createdRole.name}`);
        })
        .catch((error) => {
          throw new Error(`Failed to create new role: ${error}`);
        });
    }
  }
}
