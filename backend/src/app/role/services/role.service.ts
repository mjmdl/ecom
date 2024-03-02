import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {RoleEntity} from '../entities/role.entity';
import {Repository} from 'typeorm';
import {SetRoleDto} from '../dtos/set-role.dto';
import {UserEntity} from 'src/app/user/entities/user.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async give(roleDto: SetRoleDto): Promise<void> {
    const {roleName, userId} = roleDto;
    const userFound = await this.userRepository
      .findOne({
        select: {roles: {id: true, name: true}},
        relations: {roles: true},
        where: {id: userId},
      })
      .catch((error) => {
        console.error(`Failed to retrieve user by ID: ${error}`);
        throw new InternalServerErrorException({});
      });
    if (!userFound) {
      throw new NotFoundException({
        message: `Could not find user of ID ${userId}`,
      });
    }
    if (!userFound.roles) {
      userFound.roles = [];
    }

    const userHaveRole = userFound.roles.some((role) => role.name === roleName);
    if (userHaveRole) {
      throw new ConflictException({
        message: `User already have the role ${roleName}.`,
      });
    }

    const roleFound = await this.roleRepository
      .findOne({
        select: {id: true, name: true},
        where: {name: roleName},
      })
      .catch((error) => {
        console.error(`Failed to retrieve role by name: ${error}`);
        throw new InternalServerErrorException({});
      });
    if (!roleFound) {
      throw new NotFoundException({
        message: `Could not find role of name ${roleName}`,
      });
    }

    userFound.roles.push(roleFound);
    await this.userRepository.save(userFound).catch((error) => {
      console.error(`Failed to give role to user: ${error}`);
      throw new InternalServerErrorException({});
    });
  }

  async deny(roleDto: SetRoleDto): Promise<void> {
    const {roleName, userId} = roleDto;
    const userFound = await this.userRepository
      .findOne({
        select: {roles: {id: true, name: true}},
        relations: {roles: true},
        where: {id: userId},
      })
      .catch((error) => {
        console.error(`Failed to retrieve user by ID: ${error}`);
        throw new InternalServerErrorException({});
      });
    if (!userFound) {
      throw new NotFoundException({
        message: `Could not find user of ID ${userId}`,
      });
    }
    if (!userFound.roles) {
      userFound.roles = [];
    }

    const userHaveRole = userFound.roles.some((role) => role.name === roleName);
    if (!userHaveRole) {
      throw new ConflictException({
        message: `User does not have the role ${roleName}.`,
      });
    }

    userFound.roles = userFound.roles.filter((role) => role.name !== roleName);
    await this.userRepository.save(userFound).catch((error) => {
      console.error(`Failed to deny role from user: ${error}`);
      throw new InternalServerErrorException({});
    });
  }
}
