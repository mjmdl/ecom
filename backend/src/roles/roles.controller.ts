import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { UserDto, UserRoleDto } from './roles.dto';
import { RequireAuth, UserId } from 'src/auth/auth.guard';
import { RoleEnum } from './roles.entity';
import { RequireRole } from './roles.guard';
import { UUID } from 'crypto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('give')
  @RequireRole(RoleEnum.ROLES_MANAGER)
  giveRoleToUser(@Body() { role, userId }: UserRoleDto): Promise<void> {
    return this.rolesService.giveRoleToUser(role, userId);
  }

  @Delete('deny')
  @RequireRole(RoleEnum.ROLES_MANAGER)
  denyRoleFromUser(@Body() { role, userId }: UserRoleDto): Promise<void> {
    return this.rolesService.denyRoleFromUser(role, userId);
  }

  @Get('all')
  @RequireRole(RoleEnum.ROLES_MANAGER)
  listAllRoles(): string[] {
    return Object.values(RoleEnum);
  }

  @Get('from-user/')
  @RequireRole(RoleEnum.ROLES_MANAGER)
  listUserRoles(@Body() { userId }: UserDto): Promise<RoleEnum[]> {
    return this.rolesService.getUserRoles(userId);
  }

  @Get('list')
  @RequireAuth()
  getCurrentUserRoles(@UserId() userId: UUID): Promise<RoleEnum[]> {
    return this.rolesService.getUserRoles(userId);
  }
}
