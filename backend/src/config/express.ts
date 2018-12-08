import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import express from "express";
import passport from "passport";
import cors from "cors";
import { SESSION_SECRET } from "./env";
import { Request, Response, Application, NextFunction } from "express";
import compression from "compression";
import lusca from "lusca";
import expressValidator from "express-validator";

const app : Application = express();

app.use(cors({ origin: true, credentials: true }));
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
    csrf: true,
    xframe: "SAMEORIGIN", // could cause CORS issues?
    p3p: "ABCDEF",
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    xssProtection: true,
    nosniff: true,
    referrerPolicy: "same-origin" // could cause CORS issues?
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

export default app;
