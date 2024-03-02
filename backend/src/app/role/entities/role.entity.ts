import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Role} from '../types/role.enum';
import {UserEntity} from 'src/app/user/entities/user.entity';

@Entity({name: 'role'})
export class RoleEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({name: 'name', type: 'enum', enum: Role, unique: true})
  name!: Role;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users?: UserEntity[];
}
