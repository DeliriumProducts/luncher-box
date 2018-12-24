import { JsonController, Get, Post, Body, Req, UseBefore } from 'routing-controllers';
import { Request, Response } from 'express';
import { User, UserNotValidError, DuplicateUserError, UserNotFoundError } from '../entities';
import { transformAndValidate } from '../utils';
import { Repository, getRepository } from 'typeorm';
import { TransformValidationOptions } from 'class-transformer-validator';
import { TransformAndValidateTuple } from '../types';
import passport = require('passport');

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
  isAuthenticated(@Req() req: Request) {
    return req.isAuthenticated();
  }

  /**
   * POST /auth/register
   *
   * Register a user based on the request's body
   * @param userJSON
   */
  @Post('/register')
  async register(@Body() userJSON: User, @Req() req: Request) {
    /**
     * Check if there is a user already registered with the given email
     */
    if (await this.userRepository.findOne({ where: { email: userJSON.email } })) {
      throw new DuplicateUserError();
    }

    const [user, err] = await this.transformAndValidateUser(userJSON);

    if (err.length) {
      throw new UserNotValidError(err);
    } else {
      /**
       * Throw an error if there is a duplicate email
       */
      await this.userRepository.save(user);

      /**
       * Inject cookie sesssion
       */
      req.login(user, error => {
        if (error) {
          throw new Error(error);
        }
      });

      return 'User created!';
    }
  }

  /**
   * POST /auth/login
   *
   * Login a user based on the request body
   */
  @Post('/login')
  @UseBefore(passport.authenticate('local'))
  async login(@Req() req: Request) {
    if (req.user) {
      return 'User logged in!';
    } else {
      throw new UserNotFoundError();
    }
  }
}
