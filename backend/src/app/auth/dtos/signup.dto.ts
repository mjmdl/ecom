import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import {UserEntity} from 'src/app/user/entities/user.entity';

export class SignupDto {
  @IsOptional()
  @IsString()
  @Length(UserEntity.NAME_MIN, UserEntity.NAME_MAX)
  name?: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(UserEntity.EMAIL_MIN, UserEntity.EMAIL_MAX)
  email!: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @Length(UserEntity.PASSWORD_MIN, UserEntity.PASSWORD_MAX)
  password!: string;
}
