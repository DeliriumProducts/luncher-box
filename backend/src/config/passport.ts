import { UserNotFoundError } from './../entities/User';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getRepository, Repository } from 'typeorm';
import { User } from '../entities/';
import { QueryResponse } from '../types/';

export const initPassport = () => {
  const userRepository = getRepository(User);
  /**
   * Check the user exists in the database and if the passwords match with the one in it
   * @param email
   * @param password
   * @param done
   */
  const authenticateUser = async (email: string, password: string, done: any) => {
    const user: QueryResponse<User> = await userRepository.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      return done(null, false);
    }

    return done(null, user);
  };

  passport.use(
    new LocalStrategy(
      {
        /**
         * Use email field rather than username
         */
        usernameField: 'email'
      },
      authenticateUser
    )
  );

  /**
   * Called when logging in, injects a cookie in the session
   */
  passport.serializeUser((user: User, done: any) => {
    if (!user) {
      done(null, false);
    } else {
      done(null, user.id);
    }
  });

  /**
   * Called when trying to access protected routes, verifies the cookie from the session
   */
  passport.deserializeUser(async (id: number, done: any) => {
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      done(null, false);
    } else {
      done(null, user);
    }
  });
};
