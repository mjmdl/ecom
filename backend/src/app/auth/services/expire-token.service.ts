import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {TokenEntity} from '../entities/token.entity';
import {LessThanOrEqual, Repository} from 'typeorm';
import {Cron, CronExpression} from '@nestjs/schedule';

@Injectable()
export class ExpireTokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {
    this.expireTokens();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async expireTokens(): Promise<void> {
    try {
      const result = await this.tokenRepository.delete({
        expiresAt: LessThanOrEqual(new Date()),
      });
      console.log(`${result.affected ?? 'All'} expired tokens were deleted.`);
    } catch (error) {
      console.error(`Failed to delete expired tokens: ${error}`);
    }
  }
}
