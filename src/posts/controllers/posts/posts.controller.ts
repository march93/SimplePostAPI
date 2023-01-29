import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePostDto } from '../../../dto/posts/createPost.dto';
import { JwtAuthGuard } from '../../../auth/services/guards/jwt-auth.guard';
import { PostsService } from '../../services/posts/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  async createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
    if (req.user.userId) {
      const post = await this.postsService.createPost(
        createPostDto,
        req.user.userId,
      );
      return { id: post.id, title: post.title, text: post.text };
    }

    throw new UnauthorizedException();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Request() req, @Param('id') id: string) {
    try {
      if (req.user.userId) {
        return await this.postsService.deletePost(id, req.user.userId);
      }

      throw new UnauthorizedException();
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  async getFeed(@Request() req) {
    if (req.user.userId) {
      return await this.postsService.getFeed(req.user.userId);
    }

    throw new UnauthorizedException();
  }
}
