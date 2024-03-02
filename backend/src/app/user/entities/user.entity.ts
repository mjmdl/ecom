import {UUID} from 'crypto';
import {TokenEntity} from 'src/app/auth/entities/token.entity';
import {RoleEntity} from 'src/app/role/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({name: 'user'})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', {name: 'id'})
  id!: UUID;

  static readonly NAME_MIN: number = 3;
  static readonly NAME_MAX: number = 200;
  static readonly NAME_LENGTH: number = UserEntity.NAME_MAX;
  @Column({
    name: 'name',
    type: 'varchar',
    length: UserEntity.NAME_LENGTH,
    nullable: true,
  })
  name!: string;

  static readonly EMAIL_MIN: number = 5;
  static readonly EMAIL_MAX: number = 200;
  static readonly EMAIL_LENGTH: number = UserEntity.EMAIL_MAX;
  @Column({
    name: 'email',
    type: 'varchar',
    length: UserEntity.EMAIL_LENGTH,
    unique: true,
  })
  email!: string;

  static readonly PASSWORD_MIN: number = 8;
  static readonly PASSWORD_MAX: number = 16;
  static readonly PASSWORD_LENGTH: number = 60;
  @Column({
    name: 'password',
    type: 'varchar',
    length: UserEntity.PASSWORD_LENGTH,
    select: false,
  })
  password!: string;

  @CreateDateColumn({name: 'created_at', type: 'timestamp', select: false})
  createdAt?: Date;

  @UpdateDateColumn({name: 'updated_at', type: 'timestamp', select: false})
  updatedAt?: Date;

  @DeleteDateColumn({name: 'deleted_at', type: 'timestamp', select: false})
  deletedAt?: Date;

  @OneToMany(() => TokenEntity, (token) => token.user)
  tokens?: TokenEntity[];

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({
    name: 'users_have_roles',
    joinColumn: {name: 'user_id', referencedColumnName: 'id'},
    inverseJoinColumn: {name: 'role_id', referencedColumnName: 'id'},
  })
  roles?: RoleEntity[];
}
