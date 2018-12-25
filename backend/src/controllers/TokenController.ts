import { QueryResponse } from './../types';
import { JsonController, Get, Param } from 'routing-controllers';
import { getRepository, Repository } from 'typeorm';
import { Token, TokenNotFoundError, User } from '../entities';

@JsonController()
export class TokenController {
  tokenRepository: Repository<Token>;
  userRepository: Repository<User>;

  /**
   * Load the token repository
   */
  constructor() {
    this.tokenRepository = getRepository(Token);
    this.userRepository = getRepository(User);
  }

  @Get('/confirm/:tokenId')
  async verify(@Param('tokenId') id: string) {
    const token: QueryResponse<Token> = await this.tokenRepository.findOne(id, {
      relations: ['user']
    });

    if (!token) {
      throw new TokenNotFoundError();
    }

    /**
     * Verify user
     */
    const user = token.user;
    user.isVerified = true;

    await this.userRepository.save(user);
    await this.tokenRepository.remove(token);

    return `User ${user.name} successfully verified!`;
  }
}
