import {IsNotEmpty, IsString, Length} from 'class-validator';
import {UserEntity} from 'src/app/user/entities/user.entity';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(UserEntity.EMAIL_MIN, UserEntity.EMAIL_MAX)
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Length(UserEntity.PASSWORD_MIN, UserEntity.PASSWORD_MAX)
  password!: string;
}
