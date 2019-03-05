import { TransformValidationOptions } from 'class-transformer-validator';
import { Request } from 'express';
import nodemailer from 'nodemailer';
import passport from 'passport';
import {
  Body,
  Get,
  JsonController,
  Post,
  Req,
  UseBefore,
  InternalServerError
} from 'routing-controllers';
import { getRepository, Repository } from 'typeorm';
import { OWNER_EMAIL, OWNER_PASS, VERIFIER_EMAIL, ENV } from '../config';
import { redisConnection } from '../connections';
import { DuplicateUserError, User, UserNotFoundError, UserNotValidError } from '../entities';
import { TransformAndValidateTuple } from '../types';
import { transformAndValidate } from '../utils';
import { v4 } from 'uuid';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { sendEmail } from '../utils';

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
    }

    user.isVerified = false;
    await this.userRepository.save(user);

    /**
     * Generate verification token and save it in redis
     */
    const token = v4();
    await redisConnection.set(token, user.id, 'ex', 60 * 60 * 24); // 1 day

    /**
     * Send verification email
     */
    const confirmationURL = `http://${req.headers.host}/confirm/${token}`;

    if (ENV === 'test') {
      return `/confirm/${token}`;
    }

    const mailOptions: MailOptions = {
      from: OWNER_EMAIL,
      to: VERIFIER_EMAIL,
      subject: 'Luncher Box Account Verification',
      text: `Hello,
Please verify ${user.name}'s account (email: ${
        user.email
      }) by clicking the following link: ${confirmationURL}.`
    };

    try {
      await sendEmail(mailOptions);
      return 'Verification email sent!';
    } catch (error) {
      throw new InternalServerError('Verification email not sent!');
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
    }

    throw new UserNotFoundError();
  }

  /**
   * GET /auth/logout
   *
   * Logout a user
   */
  @Get('/logout')
  async logout(@Req() req: Request) {
    if (req.user) {
      req.logout();
      return 'User logged out!';
    }

    return 'Login to logout!';
  }
}
