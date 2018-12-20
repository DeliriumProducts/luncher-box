import { JsonController, Get, Post, Body, OnUndefined } from 'routing-controllers';
import { User, UserNotValidError, DuplicateUserError, UserNotFoundError } from '../entities';
import { transformAndValidate } from '../utils';
import { Repository, getRepository } from 'typeorm';
import { TransformValidationOptions } from 'class-transformer-validator';
import { TransformAndValidateTuple } from '../types';

@JsonController('/auth')
export class UserController {
  private userRepository: Repository<User>;
  private transformAndValidateUser: (
    obj: object | Array<{}>,
    options?: TransformValidationOptions
  ) => TransformAndValidateTuple<User>;

  /**
   * Load the User repository
   */
  constructor() {
    this.userRepository = getRepository(User);
    this.transformAndValidateUser = transformAndValidate(User);
  }

  /**
   * GET /auth
   *
   * Check if the user has been authenticated
   */
  @Get()
  isAuthenticated() {
    return undefined;
  }

  /**
   * POST /auth/register
   *
   * Register a user based on the request's body
   * @param userJSON
   */
  @Post('/register')
  async register(@Body() userJSON: User) {
    const [user, err] = await this.transformAndValidateUser(userJSON);

    if (err.length) {
      throw new UserNotValidError(err);
    } else {
      /**
       * Throw an error if there is a duplicate email
       */
      try {
        await this.userRepository.save(user);
        return {
          status: 'User created!'
        };
      } catch (error) {
        throw new DuplicateUserError();
      }
    }
  }

  @Post('/laino')
  @OnUndefined(UserNotFoundError)
  async laino(@Body() userJSON: User) {
    const email = userJSON.email;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return user.validatePassword(userJSON.password);
    } else {
      return undefined;
    }
  }
}
