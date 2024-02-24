import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity, RoleEnum } from './roles.entity';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { UserEntity } from 'src/users/users.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,

    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async giveRoleToUser(roleName: RoleEnum, userId: UUID): Promise<void> {
    const user = await this.usersRepository
      .findOne({
        where: { id: userId },
        select: { id: true, roles: true },
        relations: { roles: true },
      })
      .catch((error) => {
        console.error(error);
        throw new InternalServerErrorException({
          message: 'Failed to find user.',
        });
      });

    if (user.roles.some((role) => role.name == roleName)) {
      throw new ConflictException({ message: 'User already have the role.' });
    }

    const role = await this.rolesRepository
      .findOne({
        where: { name: roleName },
        select: { id: true },
      })
      .catch((error) => {
        console.error(error);
        throw new InternalServerErrorException({
          message: 'Failed to find role.',
        });
      });
    if (!role) {
      throw new NotFoundException({
        message: `Role ${roleName} does not exist.`,
      });
    }

    user.roles.push(role);

    await this.usersRepository.save(user).catch((error) => {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Failed to update user roles.',
      });
    });
  }

  async denyRoleFromUser(roleName: RoleEnum, userId: UUID): Promise<void> {
    const user = await this.usersRepository
      .findOne({
        where: { id: userId },
        select: { id: true, roles: { id: true, name: true } },
        relations: { roles: true },
      })
      .catch((error) => {
        console.error(error);
        throw new InternalServerErrorException({
          message: 'Failed to retrieve the user.',
        });
      });
    if (!user) {
      throw new NotFoundException('User is not found.');
    }

    const userRolesLength = user.roles.length;
    user.roles = user.roles.filter((role) => role.name !== roleName);
    if (user.roles.length === userRolesLength) {
      throw new ConflictException('User does not have the role.');
    }

    await this.usersRepository.save(user).catch((error) => {
      throw new InternalServerErrorException('Failed to deny role from user.');
    });
  }

  async getUserRoles(userId: UUID): Promise<RoleEnum[]> {
    const userRoles = await this.rolesRepository
      .find({
        where: { users: { id: userId } },
        select: { name: true },
        relations: { users: true },
      })
      .catch((error) => {
        throw new InternalServerErrorException({
          message: 'Could not retrieve user roles.',
        });
      });
    if (!userRoles || userRoles.length < 1) {
      throw new NotFoundException({ message: 'User has no roles.' });
    }
    return userRoles.map((role) => role.name);
  }
}
