import { Get, JsonController, Param, Redirect } from 'routing-controllers';
import { getRepository, Repository } from 'typeorm';
import { redisConnection } from '../connections';
import { User } from '../entities';
import { FRONTEND_URL } from './../config/env';
import { UserNotFoundError } from './../entities/User';
import { QueryResponse } from './../types/QueryResponse';

@JsonController()
export class TokenController {
  userRepository: Repository<User>;

  /**
   * Load the token repository
   */
  constructor() {
    this.userRepository = getRepository(User);
  }

  @Get('/confirm/:userId')
  @Redirect(`${FRONTEND_URL}/login`)
  async verify(@Param('userId') id: string) {
    /**
     * Verify user
     */
    const user: QueryResponse<User> = await this.userRepository.findOne(id);

    if (user && !user.isVerified) {
      user.isVerified = true;
      await this.userRepository.save(user);
    } else {
      throw new UserNotFoundError();
    }

    await redisConnection.del(id);
  }
}
