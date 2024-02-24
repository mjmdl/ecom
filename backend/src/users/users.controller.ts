import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { RequireAuth, UserId } from 'src/auth/auth.guard';
import { UserEntity } from './users.entity';
import { UUID } from 'crypto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @RequireAuth()
  profile(@UserId() userId: UUID): Promise<Partial<UserEntity>> {
    return this.usersService.getUserProfile(userId);
  }
}
