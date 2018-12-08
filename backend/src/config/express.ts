import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cors from 'cors';

export default function(app) {

    app.use(cors({ origin: true, credentials: true }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser('radoshisharkata'));
    app.use(session({
        secret: 'radoshisharkata',
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req, res, next) => {
        if (req.user) {
            res.locals.user = req.user;
        }
        next();
    });
}

