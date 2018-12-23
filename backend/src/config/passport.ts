import passport from 'passport';
import LocalPassport from 'passport-local';
import { getRepository } from 'typeorm';
import { User } from '../entities/';
import { QueryResponse } from '../types/';

const userRepository = getRepository(User);

const authenticateUser = async (email: string, password: string, done: any) => {
  const user: QueryResponse<User> = await userRepository.findOne({ where: { email } });
  if (!user) {
    return done(null, false);
  }

  if (!user.validatePassword(password)) {
    return done(null, false);
  }

  return done(null, user);
};

module.exports = () => {
  passport.use(
    new LocalPassport.Strategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      authenticateUser
    )
  );

  passport.serializeUser((user: User, done: any) => {
    if (!user) {
      done(null, false);
    } else {
      done(null, user.id);
    }
  });

  passport.deserializeUser(async (id: number, done: any) => {
    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      done(null, false);
    } else {
      done(null, user);
    }
  });
};
