import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import session from 'express-session';
import passport from 'passport';
import { Request, Response, Application, NextFunction } from 'express';
import expressValidator from 'express-validator';
import compression from 'compression';
import lusca from 'lusca';
import 'reflect-metadata';
import { SESSION_SECRET, FRONTEND_URL } from './env';
import express from 'express';
import cors from 'cors';
import { initPassport } from './';

/**
 * Create express app
 */
const app: Application = express();

/**
 * Initialize passport configuration
 */
initPassport();

/**
 * Configure express app
 */
app.use(
  cors({
    origin: FRONTEND_URL,
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
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(
  lusca({
    csrf: false, // should be true (is false only temporarily)
    xframe: 'SAMEORIGIN', // could cause CORS issues?
    p3p: 'ABCDEF',
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    xssProtection: true,
    nosniff: true,
    referrerPolicy: 'same-origin' // could cause CORS issues?
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
});

export { app };
