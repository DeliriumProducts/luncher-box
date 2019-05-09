import { TransformValidationOptions } from 'class-transformer-validator';
import { Request } from 'express';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import passport from 'passport';
import {
  Authorized,
  Body,
  Delete,
  Get,
  InternalServerError,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
  Req,
  UseBefore
} from 'routing-controllers';
import { getRepository, Repository } from 'typeorm';
import { ENV, OWNER_EMAIL, VERIFIER_EMAIL } from '../config';
import { BACKEND_URL } from '../config/env';
import { DuplicateUserError, User, UserNotFoundError, UserNotValidError } from '../entities';
import { QueryResponse, Role, TransformAndValidateTuple } from '../types';
import { sendEmail, transformAndValidate } from '../utils';

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
  async updateRole(
    @Req() req,
    @Param('staffId') staffId: string,
    @Body() { role }: { role: Role }
  ) {
    if (req.user.id === staffId) {
      throw new UserNotValidError(['cannot edit own role']);
    }

    const oldStaff: QueryResponse<User> = await this.userRepository.findOne(staffId);

    if (oldStaff) {
      const [newStaff, err] = await this.transformAndValidateUser({ ...oldStaff, role });

      if (err.length) {
        throw new UserNotValidError(err);
      }

      /**
       * Re-attach id and isVerified fields to the staff entity because they were stripped off
       */
      newStaff.id = oldStaff.id;
      newStaff.isVerified = oldStaff.isVerified;

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

    // @ts-ignore
    // tslint:disable-next-line
    let [user, err] = await this.transformAndValidateUser(userJSON);

    if (err.length) {
      throw new UserNotValidError(err);
    }

    user.isVerified = false;
    user = await this.userRepository.save(user);

    /**
     * Send verification email
     */
    const confirmationURL = `${BACKEND_URL}/confirm/${user.id}`;

    if (ENV === 'test') {
      return `/confirm/${user.id}`;
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
