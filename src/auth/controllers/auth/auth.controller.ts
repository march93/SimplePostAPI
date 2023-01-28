import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { ErrorCodes } from 'src/common/utils';
import { CreateUserDto } from 'src/dto/users/createUser.dto';

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
      if (error.code === ErrorCodes.DUPLICATE) {
        // Duplicate username or email
        throw new BadRequestException(error.message);
      }

      // For all other server errors
      throw new InternalServerErrorException(error.message);
    }
  }
}
