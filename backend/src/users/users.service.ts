import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async getUserProfile(userId: UUID): Promise<Partial<UserEntity>> {
    const userProfile = await this.usersRepository
      .findOne({
        where: { id: userId },
        select: {
          name: true,
          email: true,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException('Failed to retrieve the user.');
      });

    if (!userProfile) {
      throw new NotFoundException('User is not found.');
    }
    return userProfile;
  }
}