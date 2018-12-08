import * as passport from "passport";
import * as LocalPassport from "passport-local";
import User from "../models/user";

const authenticateUser = (username, password, done) => {
  User.findOne({ email: username }).then((user: any) => {
    if (!user) {
      return done(null, false);
    }

    if (!user.authenticate(password)) {
      return done(null, false);
    }

    return done(null, user);
  });
};

export default () => {
  passport.use(
    new LocalPassport(
      {
        usernameField: "email",
        passwordField: "password"
      },
      authenticateUser
    )
  );

  passport.serializeUser((user: any, done: Function) =>
    !user ? done(null, false) : done(null, user.id)
  );

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user =>
      !user ? done(null, false) : done(null, user)
    );
  });
};
