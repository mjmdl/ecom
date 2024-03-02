import {SetMetadata, UseGuards} from '@nestjs/common';
import {Role} from '../types/role.enum';
import {AuthGuard} from 'src/app/auth/guards/auth.guard';
import {RoleGuard} from '../guards/role.guard';

export const REQUIRED_ROLES_KEY = 'requiredRoles';

export function RequireRoles(...requiredRoles: Role[]) {
  return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    if (key && descriptor) {
      SetMetadata(REQUIRED_ROLES_KEY, requiredRoles)(target, key, descriptor);
      UseGuards(AuthGuard, RoleGuard)(target, key, descriptor);
    } else {
      SetMetadata(REQUIRED_ROLES_KEY, requiredRoles)(target);
      UseGuards(AuthGuard, RoleGuard)(target);
    }
  };
}
