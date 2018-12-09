import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { Request, Response, Application, NextFunction } from "express";
import { createExpressServer } from "routing-controllers";
import expressValidator from "express-validator";
import compression from "compression";
import lusca from "lusca";
import cors from "cors";
import 'reflect-metadata';
import { SESSION_SECRET } from "./env";
import { UserController } from "../controller/UserController";
import { CategoryController } from "../controller/CategoryController";
import { ProductController } from "../controller/ProductController";
import { TokenController } from "../controller/TokenController";

const app: Application = createExpressServer({
  controllers: [UserController, CategoryController, ProductController, TokenController]
});

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
