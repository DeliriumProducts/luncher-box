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

  @Get('/confirm/:userId')
  @Redirect(`${FRONTEND_URL}/login`)
  async verify(@Param('userId') id: string) {
    /**
     * Verify user
     */
    const user: QueryResponse<User> = await this.userRepository.findOne(id);
    console.log(user);

    if (user) {
      user.isVerified = true;
      await this.userRepository.save(user);
    } else {
      throw new UserNotFoundError();
    }

    await redisConnection.del(id);
  }
}
