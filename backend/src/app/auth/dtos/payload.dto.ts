import {UUID} from 'crypto';
import {Role} from 'src/app/role/types/role.enum';

export class PayloadDto {
  id!: UUID;
  roles?: Role[];

  exp?: number;
  iap?: number;
}
