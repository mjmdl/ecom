import { UserEntity } from 'src/users/users.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum RoleEnum {
  ROLES_MANAGER = 'roles-manager',
}

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({ type: 'enum', enum: RoleEnum, unique: true })
  name: RoleEnum;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users?: UserEntity[];
}
