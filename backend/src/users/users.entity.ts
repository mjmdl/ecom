import { UUID } from 'crypto';
import { RoleEntity } from 'src/roles/roles.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: UUID;

  static readonly NAME_MIN: number = 3;
  static readonly NAME_MAX: number = 30;
  @Column({ length: UserEntity.NAME_MAX, nullable: true })
  name?: string;

  static readonly EMAIL_MIN: number = 5;
  static readonly EMAIL_MAX: number = 100;
  @Column({ length: UserEntity.EMAIL_MAX, unique: true })
  email: string;

  static readonly PASSWORD_MIN: number = 8;
  static readonly PASSWORD_MAX: number = 16;
  static readonly PASSWORD_LENGTH: number = 60;
  @Column({ length: UserEntity.PASSWORD_LENGTH, select: false })
  password: string;

  @CreateDateColumn({ select: false })
  created?: Date;

  @UpdateDateColumn({ select: false })
  updated?: Date;

  @DeleteDateColumn({ select: false })
  deleted?: Date;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({
    name: 'users_have_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles?: RoleEntity[];
}
