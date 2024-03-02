import {SetMetadata, UseGuards} from '@nestjs/common';
import {Role} from '../types/role.enum';
import {AuthGuard} from 'src/app/auth/guards/auth.guard';
import {RoleGuard} from '../guards/role.guard';

export const ALLOWED_ROLES_KEY = 'allowedRoles';

export function AllowRoles(...allowedRoles: Role[]) {
  return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    if (key && descriptor) {
      SetMetadata(ALLOWED_ROLES_KEY, allowedRoles)(target, key, descriptor);
      UseGuards(AuthGuard, RoleGuard)(target, key, descriptor);
    } else {
      SetMetadata(ALLOWED_ROLES_KEY, allowedRoles)(target);
      UseGuards(AuthGuard, RoleGuard)(target);
    }
  };
}
