import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { CreateUserDto } from 'src/dto/users/createUser.dto';
import { GetUserDto } from 'src/dto/users/getUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async registerUser(@Body() createUserDto: CreateUserDto) {
    try {
      await this.authService.createUser(createUserDto);
      return { message: 'User created successfully' };
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async loginUser(@Body() getUserDto: GetUserDto) {
    try {
      await this.authService.getUser(getUserDto);
      return { token: 'success' };
    } catch (error) {
      throw error;
    }
  }
}
