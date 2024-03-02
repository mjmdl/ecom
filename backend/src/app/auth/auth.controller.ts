import {
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {AuthService} from './services/auth.service';
import {LoginDto} from './dtos/login.dto';
import {SignupDto} from './dtos/signup.dto';
import {TokenDto} from './dtos/token.dto';
import {NewUserDto} from './dtos/new-user.dto';
import {RequireAuth} from './decorators/require-auth.decorator';
import {BearerToken} from './decorators/bearer-token.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto): Promise<NewUserDto> {
    try {
      return this.authService.signup(signupDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(`Unespected error: POST auth/signup: ${error}`);
        throw new InternalServerErrorException({});
      }
    }
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    try {
      return this.authService.login(loginDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(`Unespected error: POST auth/login: ${error}`);
        throw new InternalServerErrorException({});
      }
    }
  }

  @Post('logout')
  @RequireAuth()
  logout(@BearerToken() bearerToken: string): Promise<void> {
    try {
      return this.authService.logout(bearerToken);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(`Unespected error: POST auth/login: ${error}`);
        throw new InternalServerErrorException({});
      }
    }
  }
}
