import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/users/createUser.dto';
import { GetUserDto } from 'src/dto/users/getUser.dto';
import { User } from 'src/models';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  static async generateHash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async createUser(createUserDto: CreateUserDto) {
    // Hash password
    const password = await AuthService.generateHash(createUserDto.password);
    const user = this.userRepository.create({ ...createUserDto, password });
    return this.userRepository.save(user);
  }

  async getUser(getUserDto: GetUserDto) {
    return this.userRepository.findOne({
      where: { email: getUserDto.email, password: getUserDto.password },
    });
  }
}
