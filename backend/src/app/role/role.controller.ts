import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {RoleService} from './services/role.service';
import {Role} from './types/role.enum';
import {AllowRoles} from './decorators/allow-roles.decorator';
import {SetRoleDto} from './dtos/set-role.dto';

@Controller('role')
@AllowRoles(Role.ROLES_MANAGER)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('all')
  getAll(): Role[] {
    return Object.values(Role);
  }

  @Post('give')
  give(@Body() roleDto: SetRoleDto): Promise<void> {
    try {
      return this.roleService.give(roleDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(`Unespected error: POST role/give: ${error}`);
        throw new InternalServerErrorException({});
      }
    }
  }

  @Delete('deny')
  deny(@Body() roleDto: SetRoleDto): Promise<void> {
    try {
      return this.roleService.deny(roleDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(`Unespected error: DELETE role/deny: ${error}`);
        throw new InternalServerErrorException({});
      }
    }
  }
}
