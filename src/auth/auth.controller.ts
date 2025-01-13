import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Public } from './public-strategy';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() signUpDto: CreateUserDto) {
    const payload = {
      email: signUpDto.email,
      password: signUpDto.password,
      username: signUpDto.username,
      age: signUpDto.age,
    };

    return this.authService.signUp(payload);
  }
}
