import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getRepository } from 'typeorm';
import { User } from '../entities/';
import { QueryResponse } from '../types/';

const userRepository = getRepository(User);

const loginUser = async (email: string, password: string, done: any) => {
  const user: QueryResponse<User> = await userRepository.findOne({ where: { email } });
  if (!user || !user.validatePassword(password)) {
    return done(null, false, { isValid: false });
  }

  return done(null, user);
};

const registerUser = async (email: string, password: string, done: any) => {
  const user: QueryResponse<User> = await userRepository.findOne({ where: { email } });
  if (user) {
    return done(null, false, { isTaken: true });
  }

  return done(null, user);
};

export const initPassport = () => {
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      loginUser
    )
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      registerUser
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
