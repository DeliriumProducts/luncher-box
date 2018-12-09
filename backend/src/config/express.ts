import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import session from 'express-session';
import passport from 'passport';
import { Request, Response, Application, NextFunction } from 'express';
import { useExpressServer } from 'routing-controllers';
import expressValidator from 'express-validator';
import compression from 'compression';
import lusca from 'lusca';
import 'reflect-metadata';
import { SESSION_SECRET } from './env';
import express = require('express');
import cors = require('cors');

// create express app
const app: Application = express();

// configure express app
app.use(
  cors({
    origin: true,
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

// set up routing-controllers
useExpressServer(app, {
  controllers: [`${__dirname}/../controllers/*.ts`]
});

export default app;
