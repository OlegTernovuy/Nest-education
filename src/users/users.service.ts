import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UsersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const candidate = await this.findOneByEmail(createUserDto.email);
    if (candidate) {
      throw new ConflictException(`User ${createUserDto.email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = new User();

    user.email = createUserDto.email;
    user.password = hashedPassword;
    user.username = createUserDto.username;
    user.age = createUserDto.age;

    return await this.UsersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.UsersRepository.find();
  }

  async findOne(userId: number): Promise<User | null> {
    return await this.UsersRepository.findOne({ where: { userId } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.UsersRepository.findOne({ where: { email } });
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.UsersRepository.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    await this.UsersRepository.update(userId, updateUserDto);
    return user;
  }

  async remove(userId: number) {
    const user = await this.UsersRepository.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    return await this.UsersRepository.delete(userId);
  }
}
