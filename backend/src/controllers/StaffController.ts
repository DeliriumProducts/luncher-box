import { TransformValidationOptions } from 'class-transformer-validator';
import { Request } from 'express';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import passport from 'passport';
import {
  Body,
  Get,
  InternalServerError,
  JsonController,
  Post,
  Req,
  UseBefore,
  QueryParam,
  Authorized,
  Param,
  Put,
  Delete
} from 'routing-controllers';
import { getRepository, Repository, MoreThan, EntityRepository } from 'typeorm';
import { v4 } from 'uuid';
import { ENV, OWNER_EMAIL, VERIFIER_EMAIL } from '../config';
import { redisConnection } from '../connections';
import { DuplicateUserError, User, UserNotFoundError, UserNotValidError } from '../entities';
import { TransformAndValidateTuple, Role, QueryResponse } from '../types';
import { sendEmail, transformAndValidate } from '../utils';
import { BACKEND_URL } from '../config/env';

@JsonController('/staff')
export class StaffController {
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
   * GET /staff
   *
   * Gets all staff members
   */
  @Get()
  @Authorized('Admin')
  async getAll(@QueryParam('page') page?: number, @QueryParam('limit') limit: number = 0) {
    if (page) {
      const staff = await this.userRepository.find({
        skip: limit * (page - 1),
        take: limit,
        cache: true
      });

      /**
       * Return only relevant info
       */
      return staff.map((user: User) => {
        const { password, ...s } = user;
        return s;
      });
    } else {
      const staff = await this.userRepository.find({
        take: limit,
        cache: true
      });

      /**
       * Return only relevant info
       */
      return staff.map((user: User) => {
        const { password, ...s } = user;
        return s;
      });
    }
  }

  /**
   * PUT /staff/:staffId
   *
   * Update staff role
   */
  @Put('/:staffId')
  @Authorized('Admin')
  async updateRole(@Param('staffId') staffId: string, @Body() { role }: { role: Role }) {
    const oldStaff: QueryResponse<User> = await this.userRepository.findOne(staffId);

    if (oldStaff) {
      const [newStaff, err] = await this.transformAndValidateUser({ ...oldStaff, role });

      if (err.length) {
        throw new UserNotValidError(err);
      }

      newStaff.id = oldStaff.id;

      const { password, ...staffWithoutPassword } = await this.userRepository.save(newStaff);
      return staffWithoutPassword;
    }

    throw new UserNotFoundError();
  }

  /**
   * DELETE /staff/:staffId
   *
   * Delete a staff member
   */
  @Delete('/:staffId')
  @Authorized('Admin')
  async deleteStaff(@Param('staffId') staffId: string) {
    /**
     * Check if the staff member exists before deleting it
     */
    const staffToBeDeleted: QueryResponse<User> = await this.userRepository.findOne(staffId);

    if (staffToBeDeleted) {
      await this.userRepository.delete(staffId);
      return 'Staff member deleted!';
    }

    throw new UserNotFoundError();
  }

  /**
   * GET /staff/auth
   *
   * Check if the user has been authenticated
   */
  @Get('/auth')
  isAuthenticated(@Req() req: Request) {
    if (!req.user) {
      return {
        isAuthenticated: req.isAuthenticated()
      };
    } else {
      const { password, ...staffWithoutPassword } = req.user;

      return {
        user: staffWithoutPassword,
        isAuthenticated: req.isAuthenticated()
      };
    }
  }

  /**
   * POST /staff/auth/register
   *
   * Register a user based on the request's body
   * @param userJSON
   */
  @Post('/auth/register')
  async register(@Body() userJSON: User, @Req() req: Request) {
    /**
     * Check if there is a user already registered with the given email
     */
    if (await this.userRepository.findOne({ where: { email: userJSON.email } })) {
      throw new DuplicateUserError();
    }

    /**
     * Ensure nobody can make themself an admin or any other role
     */
    userJSON.role = 'Waiter';

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
    const confirmationURL = `${BACKEND_URL}/confirm/${token}`;

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
   * POST /staff/auth/login
   *
   * Login a user based on the request body
   */
  @Post('/auth/login')
  @UseBefore(passport.authenticate('local'))
  async login(@Req() req: Request) {
    if (req.user) {
      return 'User logged in!';
    }

    throw new UserNotFoundError();
  }

  /**
   * GET /staff/auth/logout
   *
   * Logout a user
   */
  @Get('/auth/logout')
  async logout(@Req() req: Request) {
    if (req.user) {
      req.logout();
      return 'User logged out!';
    }

    return 'Login to logout!';
  }
}
