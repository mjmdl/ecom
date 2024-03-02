import {DataSource, ViewColumn, ViewEntity} from 'typeorm';
import {UserEntity} from '../entities/user.entity';
import {UUID} from 'crypto';
import {RoleEntity} from 'src/app/role/entities/role.entity';
import {Role} from 'src/app/role/types/role.enum';

@ViewEntity({
  name: 'user_profile_view',
  dependsOn: [UserEntity, RoleEntity],
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('user.id', 'id')
      .addSelect('user.name', 'name')
      .addSelect('user.email', 'email')
      .addSelect('JSON_AGG(role.name)', 'roles')
      .from(UserEntity, 'user')
      .leftJoin('user.roles', 'role')
      .groupBy('user.id'),
})
export class UserProfileView {
  @ViewColumn({name: 'id'})
  id!: UUID;

  @ViewColumn({name: 'name'})
  name!: string;

  @ViewColumn({name: 'email'})
  email!: string;

  @ViewColumn({name: 'roles'})
  roles?: Role[];
}
