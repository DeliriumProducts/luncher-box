import bodyParser from 'body-parser';
import compression from 'compression';
import createRedisStore from 'connect-redis';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import session from 'express-session';
import expressValidator from 'express-validator';
import lusca from 'lusca';
import passport from 'passport';
import 'reflect-metadata';
import { redisConnection } from '../connections';
import { FRONTEND_URL, IS_DEV, SESSION_SECRET, ENV } from './env';

/**
 * Initialize connect-redis session
 */
const RedisStore = createRedisStore(session);
const store = new RedisStore({
  client: redisConnection as any
});

if (ENV === 'test') {
  // @ts-ignore
  store.client.unref();
}

/**
 * Create express app
 */
const app: Application = express();

/**
 * Configure express app
 */
app.use(
  cors({
    /**
     * During develpoment we enable it, so that the backend can be accessed from anywhere
     * During production we make sure it's only accesible from the FRONTEND_URL env variable
     */
    origin: IS_DEV || FRONTEND_URL,
    credentials: true
  })
);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(SESSION_SECRET));
app.use(expressValidator());
app.use(
  session({
    store,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24
    }
  })
);
app.use(
  lusca({
    csrf: !IS_DEV,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    xssProtection: true,
    nosniff: true,
    referrerPolicy: 'same-origin'
  })
);
app.use(passport.initialize());
app.use(passport.session());

/**
 * If redis is down, we still need to give some kind info to the user
 */
app.use((req, _, next) => {
  if (!req.session) {
    return next(new Error('Internal server error'));
  }
  next();
});

export { app };
