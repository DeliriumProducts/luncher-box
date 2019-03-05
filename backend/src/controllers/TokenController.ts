import { UserNotFoundError } from './../entities/User';
import { QueryResponse } from './../types/QueryResponse';
import { Get, JsonController, Param, Redirect, NotFoundError } from 'routing-controllers';
import { getRepository, Repository } from 'typeorm';
import { User } from '../entities';
import { FRONTEND_URL } from './../config/env';
import { redisConnection } from '../connections';

@JsonController()
export class TokenController {
  userRepository: Repository<User>;

  /**
   * Load the token repository
   */
  constructor() {
    this.userRepository = getRepository(User);
  }

  @Get('/confirm/:tokenId')
  @Redirect(`${FRONTEND_URL}/login`)
  async verify(@Param('tokenId') id: string) {
    /**
     * Get the userId which matches to the corresponding token
     */
    const userId = await redisConnection.get(id);

    if (!userId) {
      throw new NotFoundError('Token not found!');
    }

    /**
     * Verify user
     */
    const user: QueryResponse<User> = await this.userRepository.findOne({ where: { id: userId } });

    if (user) {
      user.isVerified = true;
      await this.userRepository.save(user);
    } else {
      throw new UserNotFoundError();
    }

    await redisConnection.del(id);
  }
}
