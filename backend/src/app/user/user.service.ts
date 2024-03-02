import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UUID} from 'crypto';
import {UserProfileView} from './views/user-profile.view';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserProfileView)
    private readonly userProfileRepository: Repository<UserProfileView>,
  ) {}

  async getProfile(id: UUID): Promise<UserProfileView> {
    const userProfile = await this.userProfileRepository
      .findOne({where: {id}})
      .catch((error) => {
        console.error(`Failed to find profile of user of id ${id}: ${error}`);
        throw new InternalServerErrorException({});
      });
    if (!userProfile) {
      throw new NotFoundException('Could not find user.');
    }
    if (!userProfile.roles || userProfile.roles[0] == null) {
      delete userProfile.roles;
    }
    return userProfile;
  }
}
