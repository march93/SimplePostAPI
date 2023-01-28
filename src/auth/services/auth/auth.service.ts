import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/users/createUser.dto';
import { GetUserDto } from 'src/dto/users/getUser.dto';
import { User } from 'src/models';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ErrorCodes } from 'src/common/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  static async generateHash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      // Hash password
      const password = await AuthService.generateHash(createUserDto.password);
      const user = this.userRepository.create({ ...createUserDto, password });
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === ErrorCodes.DUPLICATE) {
        // Duplicate username or email
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  async getUser(getUserDto: GetUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: getUserDto.email },
      });
      if (!user) {
        throw new NotFoundException('Email not found');
      }

      const passwordMatched = await bcrypt.compare(
        getUserDto.password,
        user.password,
      );
      if (!passwordMatched) {
        throw new BadRequestException('Invalid password');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
