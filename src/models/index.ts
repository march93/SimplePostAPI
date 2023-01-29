import { Post } from './post.entity';
import { User } from './user.entity';

const entities = [User, Post];

export { User, Post };

// Export entities to be set in TypeOrmModule
export default entities;
