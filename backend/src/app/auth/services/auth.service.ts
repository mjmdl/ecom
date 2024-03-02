import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {Repository} from 'typeorm';
import {TokenEntity} from '../entities/token.entity';
import {UserEntity} from '../../user/entities/user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {LoginDto} from '../dtos/login.dto';
import {SignupDto} from '../dtos/signup.dto';
import {TokenDto} from '../dtos/token.dto';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {ConfigService} from '@nestjs/config';
import {PayloadDto} from '../dtos/payload.dto';
import {NewUserDto} from '../dtos/new-user.dto';

@Injectable()
export class AuthService {
  private readonly PASSWORD_ROUNDS: number;
  private readonly JWT_SECRET: string;

  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly jwtService: JwtService,

    configService: ConfigService,
  ) {
    this.PASSWORD_ROUNDS = configService.getOrThrow(
      'BCRYPT_ROUNDS_FOR_PASSWORD',
    );
    this.JWT_SECRET = configService.getOrThrow('JSONWEBTOKEN_SECRET');
  }

  async signup(signupDto: SignupDto): Promise<NewUserDto> {
    const {name, email, password} = signupDto;
    const emailIsTaken = await this.userRepository
      .exists({where: {email}})
      .catch((error) => {
        console.error(
          `Failed to validate that email ${email} is not already taken: ${error}`,
        );
        throw new InternalServerErrorException({});
      });
    if (emailIsTaken) {
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt
      .genSalt(this.PASSWORD_ROUNDS)
      .then((salt) => bcrypt.hash(password, salt))
      .catch((error) => {
        console.error(`Failed to hash user password: ${error}`); // TODO: Can this expose sensible data?
        throw new InternalServerErrorException({});
      });

    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    const createdUser = await this.userRepository
      .save(newUser)
      .catch((error) => {
        console.error(`Failed to save user in the database: ${error}`);
        throw new InternalServerErrorException({});
      });

    return {id: createdUser.id};
  }

  async login(loginDto: LoginDto): Promise<TokenDto> {
    const {email, password} = loginDto;

    const foundUser = await this.userRepository
      .findOne({
        where: {email},
        select: {id: true, password: true},
      })
      .catch((error) => {
        console.error(`Failed to find user in the database: ${error}`);
        throw new InternalServerErrorException({});
      });
    if (!foundUser) {
      throw new NotFoundException(
        `Could not find user by the e-mail ${email}.`,
      );
    }

    const passwordIsCorrect = await bcrypt
      .compare(password, foundUser.password)
      .catch((error) => {
        console.error(`Failed to validate user passwords: ${error}`); // TODO: Can this expose sensible data?
        throw new InternalServerErrorException({});
      });
    if (!passwordIsCorrect) {
      throw new UnauthorizedException('Password is wrong.');
    }

    const payloadDto: PayloadDto = {id: foundUser.id};
    const token = await this.jwtService
      .signAsync({...payloadDto}, {secret: this.JWT_SECRET})
      .catch((error) => {
        console.error(`Failed to sign bearer token: ${error}`);
        throw new InternalServerErrorException({});
      });

    const tokenPayload = await this.getTokenPayload(token);
    const expiresAt = new Date(tokenPayload.exp! * 1000);

    const newToken = this.tokenRepository.create({
      bearer: token,
      expiresAt,
      user: {id: foundUser.id},
    });
    await this.tokenRepository.save(newToken).catch((error) => {
      console.error(`Failed to save token to the database: ${error}`);
      throw new InternalServerErrorException({});
    });

    return {bearerToken: token};
  }

  async logout(bearer: string): Promise<void> {
    await this.tokenRepository.delete({bearer}).catch((error) => {
      console.error(`Failed to delete bearer token: ${error}`);
      throw new InternalServerErrorException({});
    });
  }

  async validateBearerToken(bearer: string): Promise<boolean> {
    const foundToken = await this.tokenRepository
      .findOne({select: {expiresAt: true}, where: {bearer}})
      .catch((error) => {
        console.error(`Failed to retrieve token from database: ${error}`);
        throw new InternalServerErrorException({});
      });
    if (!foundToken) {
      throw new NotFoundException({message: 'Token is not found.'});
    }

    if (foundToken.expiresAt < new Date()) {
      await this.tokenRepository.delete({bearer});
      throw new UnauthorizedException({message: 'Token is expired.'});
    }

    if (!foundToken) {
      throw new UnauthorizedException({message: 'Token is invalid.'});
    } else {
      return true;
    }
  }

  async getTokenPayload(token: string): Promise<PayloadDto> {
    const payloadDto: PayloadDto = await this.jwtService
      .verifyAsync(token, {
        secret: this.JWT_SECRET,
      })
      .catch((error) => {
        console.error(`Failed to extract token: ${error}`);
        throw new InternalServerErrorException({});
      });

    const foundUser = await this.userRepository
      .findOne({
        select: {roles: {name: true}},
        relations: {roles: true},
        where: {id: payloadDto.id},
      })
      .catch((error) => {
        console.error(`Failed to retrieve user by ID: ${error}`);
        throw new InternalServerErrorException({});
      });
    if (!foundUser) {
      throw new NotFoundException({message: 'User is not found.'});
    }

    payloadDto.roles = foundUser.roles!.map((role) => role.name);
    return payloadDto;
  }
}
