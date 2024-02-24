import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { LoginDto, PayloadDto, SignupDto, CurrentUser } from './auth.dto';
import { compare, genSalt, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UUID } from 'crypto';

@Injectable()
export class AuthService {
  private readonly PASSWORD_ROUNDS: number;
  private readonly JWT_SECRET: string;

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    private readonly jwtService: JwtService,

    configService: ConfigService,
  ) {
    this.PASSWORD_ROUNDS = +configService.get<number>('BCRYPT_PASSWORD_ROUNDS');
    this.JWT_SECRET = configService.get<string>('JSONWEBTOKEN_SECRET');
  }

  async signup(signupDto: SignupDto): Promise<void> {
    const { name, email, password } = signupDto;

    const emailIsUsed = await this.usersRepository
      .exists({ where: { email } })
      .catch((error) => {
        console.error(error);
        throw new InternalServerErrorException('Failed to validate email.');
      });
    if (emailIsUsed) {
      throw new ConflictException('Email is already used.');
    }

    const hashedPassword = await hash(
      password,
      await genSalt(this.PASSWORD_ROUNDS).catch((error) => {
        console.error(error);
        throw new InternalServerErrorException(
          'Failed to generate the password salt.',
        );
      }),
    ).catch((error) => {
      console.error(error);
      throw new InternalServerErrorException('Failed to hash the password.');
    });

    const newUser = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    await this.usersRepository.insert(newUser).catch((error) => {
      console.error(error);
      throw new InternalServerErrorException('Failed to register user.');
    });
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;

    const user = await this.usersRepository
      .findOne({
        where: { email },
        select: { id: true, password: true, roles: { name: true } },
        relations: { roles: true },
      })
      .catch((error) => {
        throw new InternalServerErrorException('Failed to search for user.');
      });
    if (!user) {
      throw new NotFoundException('User is not found.');
    }

    const passwordIsCorrect = await compare(password, user.password).catch(
      (error) => {
        throw new InternalServerErrorException(
          'Failed to compare the passwords.',
        );
      },
    );
    if (!passwordIsCorrect) {
      throw new UnauthorizedException('Password is wrong.');
    }

    const payloadDto = new PayloadDto(user.id);
    const bearerToken = await this.jwtService
      .signAsync({ ...payloadDto }, { secret: this.JWT_SECRET })
      .catch((error) => {
        throw new InternalServerErrorException(
          'Failed to sign the bearer token.',
        );
      });
    return bearerToken;
  }

  async extractBearerToken(authorization: string): Promise<PayloadDto> {
    const [type, token] = authorization.split(' ') ?? [];
    if (type.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Bearer token is not provided.');
    }

    const payloadDto: PayloadDto = await this.jwtService
      .verifyAsync(token, {
        secret: this.JWT_SECRET,
      })
      .catch((error) => {
        throw new UnauthorizedException('Token is not valid.');
      });
    return payloadDto;
  }

  async getUserContext(userId: UUID): Promise<CurrentUser> {
    const user = await this.usersRepository
      .findOneOrFail({
        where: { id: userId },
        select: { roles: { name: true } },
        relations: { roles: true },
      })
      .catch((error) => {
        console.error(error);
        throw new InternalServerErrorException();
      });
    return new CurrentUser(
      userId,
      user.roles.map((role) => role.name),
    );
  }
}
