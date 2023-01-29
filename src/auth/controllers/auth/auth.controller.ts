import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { CreateUserDto } from '../../../dto/users/createUser.dto';
import { LocalAuthGuard } from '../../services/guards/local-auth.guard';

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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Delete(':email')
  @HttpCode(204)
  async deleteUser(@Param('email') email: string) {
    try {
      await this.authService.deleteUserByEmail(email);
    } catch (error) {
      throw error;
    }
  }
}
