import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UseGuards,
  mixin,
} from '@nestjs/common';
import { RoleEnum } from './roles.entity';
import { RolesService } from './roles.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser, PayloadDto } from 'src/auth/auth.dto';

export function RequireRole(...requiredRoles: RoleEnum[]) {
  @Injectable()
  class RolesGuard implements CanActivate {
    constructor(private readonly rolesService: RolesService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: Request = context.switchToHttp().getRequest();

      const currentUser = request[AuthGuard.USER_KEY] as CurrentUser;
      if (!currentUser) {
        throw new ForbiddenException('Invalid credentials.');
      }

      const userRoles = await this.rolesService
        .getUserRoles(currentUser.id)
        .catch((error) => {
          throw new ForbiddenException('Missing privileges.');
        });

      const userHasAllRoles = requiredRoles.every((role) =>
        userRoles.includes(role),
      );

      if (!userHasAllRoles) {
        throw new ForbiddenException('Missing required privileges.');
      }

      return true;
    }
  }
  return UseGuards(AuthGuard, mixin(RolesGuard));
}
