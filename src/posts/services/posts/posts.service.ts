import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from '../../../dto/posts/createPost.dto';
import { Repository } from 'typeorm';
import { Post, User } from '../../../models';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createPost(createPostDto: CreatePostDto, userId: string) {
    // User should exist here already
    // Unauthorized users should have been caught by the guard earlier
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const post = this.postRepository.create({ ...createPostDto, user });
    return await this.postRepository.save(post);
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (post.user.id !== userId) {
      throw new UnauthorizedException();
    }

    await this.postRepository.delete(post);
  }

  async getFeed(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['posts'],
    });
    return user.posts;
  }
}
