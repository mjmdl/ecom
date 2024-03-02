import {UUID} from 'crypto';
import {Role} from '../types/role.enum';
import {IsEnum, IsNotEmpty, IsUUID} from 'class-validator';

export class SetRoleDto {
  @IsNotEmpty()
  @IsUUID()
  userId!: UUID;

  @IsNotEmpty()
  @IsEnum(Role)
  roleName!: Role;
}
