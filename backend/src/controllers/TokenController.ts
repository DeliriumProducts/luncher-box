import { Authorized, BadRequestError, Get, JsonController, Param } from 'routing-controllers';
import { getRepository, Repository } from 'typeorm';
import { User } from '../entities';
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
  @Authorized('Admin')
  async verify(@Param('userId') id: string) {
    /**
     * Verify user
     */
    const user: QueryResponse<User> = await this.userRepository.findOne(id);

    if (!user) {
      throw new UserNotFoundError();
    } else if (!user.isVerified) {
      user.isVerified = true;
      return await this.userRepository.save(user);
    } else {
      throw new BadRequestError('User already verified');
    }
  }
}
