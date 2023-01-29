import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dto/users/createUser.dto';
import { GetUserDto } from 'src/dto/users/getUser.dto';
import { User } from '../../../models';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ErrorCodes } from '../../../common/utils';

@Injectable()
export class AuthService extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    super();
  }

  static async generateHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  static async validatePassword(password: string, encrypted: string) {
    return await bcrypt.compare(password, encrypted);
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      // Hash password
      const password = await AuthService.generateHash(createUserDto.password);
      const user = this.userRepository.create({ ...createUserDto, password });
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === ErrorCodes.DUPLICATE) {
        // Duplicate username or email
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  async validateUserId(userId: string) {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async validateUser(getUserDto: GetUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: getUserDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    if (
      await AuthService.validatePassword(getUserDto.password, user.password)
    ) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = { userId: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  // For clearing users when testing
  async deleteUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.delete(user);
    } catch (error) {
      throw error;
    }
  }
}
