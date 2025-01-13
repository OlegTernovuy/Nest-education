import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(`User ${email} not found`);
    }

    if (user.password !== undefined) {
      this.checkPassword(password, user.password);
    }

    const payload = { sub: user.userId, email: user.email };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async signUp(payload: CreateUserDto) {
    return await this.usersService.create(payload);
  }

  private checkPassword(rawPassword: string, hashPassword: string): void {
    const isPasswordValid = compareSync(rawPassword, hashPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }
  }
}
