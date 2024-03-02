import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {ALLOWED_ROLES_KEY} from '../decorators/allow-roles.decorator';
import {Reflector} from '@nestjs/core';
import {Role} from '../types/role.enum';
import {AuthGuard} from 'src/app/auth/guards/auth.guard';
import {PayloadDto} from 'src/app/auth/dtos/payload.dto';
import {REQUIRED_ROLES_KEY} from '../decorators/require-roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const controller = context.getClass();
    const payloadDto: PayloadDto = request[AuthGuard.USER_KEY];
    const userRoles: Role[] = payloadDto.roles ?? [];

    const requiredRoles =
      this.reflector.get<Role[]>(REQUIRED_ROLES_KEY, handler) ||
      this.reflector.get<Role[]>(REQUIRED_ROLES_KEY, controller);

    if (requiredRoles) {
      if (userRoles.length == 0) {
        return false;
      }

      for (const role of requiredRoles) {
        const userHasRole = userRoles.includes(role);
        if (!userHasRole) {
          return false;
        }
      }
    }

    const allowedRoles =
      this.reflector.get<Role[]>(ALLOWED_ROLES_KEY, handler) ||
      this.reflector.get<Role[]>(ALLOWED_ROLES_KEY, controller);

    if (allowedRoles) {
      if (userRoles.length == 0) {
        return false;
      }

      for (const role of allowedRoles) {
        const userHasRole = userRoles.includes(role);
        if (userHasRole) {
          return true;
        }
      }
      return false;
    }

    return true;
  }
}
