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
import { SESSION_SECRET, FRONTEND_URL, IS_DEV } from './env';
import express from 'express';
import cors from 'cors';

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
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(
  lusca({
    /**
     * CSRF should be enabled in production
     */
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

export { app };
