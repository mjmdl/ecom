import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { RoleEnum } from './roles.entity';
import { UUID } from 'crypto';

export class UserRoleDto {
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: RoleEnum;

  @IsNotEmpty()
  @IsUUID()
  userId: UUID;
}

export class UserDto {
  @IsNotEmpty()
  @IsUUID()
  userId: UUID;
}
