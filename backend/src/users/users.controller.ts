import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Payload, RequireAuth } from 'src/auth/auth.guard';
import { PayloadDto } from 'src/auth/auth.dto';
import { UserEntity } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @RequireAuth()
  profile(@Payload() payloadDto: PayloadDto): Promise<Partial<UserEntity>> {
    return this.usersService.getUserProfile(payloadDto.userId);
  }
}
