import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { SESSION_SECRET } from './env';
import { Request, Response, Application, NextFunction } from "express";
import compression from "compression"; 
import lusca from "lusca";
import path from "path";
import expressValidator from "express-validator";
import bluebird from "bluebird";

export default (app: Application) => {
  app.use(cors({ origin: true, credentials: true }));
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(SESSION_SECRET));
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false
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
};
