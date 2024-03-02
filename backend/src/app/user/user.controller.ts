import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import {UserService} from './user.service';
import {
  CurrentUser,
  CurrentUserDto,
} from '../auth/decorators/current-user.decorator';
import {RequireAuth} from '../auth/decorators/require-auth.decorator';
import {UserProfileView} from './views/user-profile.view';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @RequireAuth()
  getProfile(@CurrentUser() userDto: CurrentUserDto): Promise<UserProfileView> {
    try {
      return this.userService.getProfile(userDto.id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(`Unespected error: GET user/profile: ${error}`);
        throw new InternalServerErrorException({});
      }
    }
  }
}
