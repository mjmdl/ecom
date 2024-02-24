import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  Length,
} from 'class-validator';
import { UUID } from 'crypto';
import { UserEntity } from 'src/users/users.entity';

export class SignupDto {
  @IsOptional()
  @IsString()
  @Length(UserEntity.NAME_MIN, UserEntity.NAME_MAX)
  name?: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(UserEntity.EMAIL_MIN, UserEntity.EMAIL_MAX)
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @Length(UserEntity.PASSWORD_MIN, UserEntity.PASSWORD_MAX)
  password: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(UserEntity.EMAIL_MIN, UserEntity.EMAIL_MAX)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(UserEntity.PASSWORD_MIN, UserEntity.PASSWORD_MAX)
  password: string;
}

export class PayloadDto {
  @IsNotEmpty()
  @IsUUID()
  userId: UUID;

  constructor(userId: UUID) {
    this.userId = userId;
  }
}

export class TokenDto {
  constructor(public bearerToken: string) {}
}
