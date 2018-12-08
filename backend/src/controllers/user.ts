import encryption from "../utils/encryption";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import User from "../models/user";
import Token from "../models/token";
import handleError from "../utils/handleError";

export default {
  register: (req, res) => {
    let salt = encryption.generateSalt();
    let passwordHash = encryption.hashPassword(req.body.password, salt);
    let user = new User({
      email: req.body.email,
      passwordHash: passwordHash,
      name: req.body.name,
      salt: salt,
      isVerified: false
    });

    user
      .save()
      .then((user: any) => {
        let token = new Token({
          _userId: user._id,
          token: crypto.randomBytes(16).toString("hex")
        });

        // Save the verification token
        token.save().then((token: any) => {
          // Send the email
          let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: process.env.OWNER_EMAIL,
              pass: process.env.OWNER_PASS
            }
          });

          let confrimationURL =
            "\nhttp://" +
            req.headers.host +
            "/confirmation/" +
            token.token +
            "\n";

          let mailOptions = {
            from: process.env.OWNER_EMAIL,
            to: process.env.VERIFIER_EMAIL,
            subject: "Luncher Box Account Verification",
            text:
              "Hello,\n\n" +
              "Please verify your employee account by clicking the following link: " +
              confrimationURL +
              "\n\n Employee name: " +
              user.name
          };

          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              throw {
                status: 500,
                msg: "Verification email not sent!"
              };
            } else {
              res.status(200).send({
                msg: "Verification email sent!"
              });
            }
          });
        });
      })
      .catch(err => handleError(err, res));
  },

  loginPost: (req, res) => {
    let loginArgs = req.body;
    User.findOne({ email: loginArgs.email })
      .then((user: any) => {
        if (!user || !user.authenticate(loginArgs.password)) {
          throw {
            status: 401,
            msg: "Username or password is invalid."
          };
        }

        // Check if user is verified
        if (!user.isVerified) {
          throw {
            status: 401,
            msg: "Your account has not been verified yet."
          };
        }
        req.login(user, err => {
          if (err) {
            throw {
              status: 401,
              msg: "Error occured while trying to login."
            };
          } else {
            res.status(200).send({
              msg: "User logged in!"
            });
          }
        });
      })
      .catch(err => handleError(err, res));
  },

  logout: (req, res) => {
    req.logOut();
    res.status(200).send({
      msg: "User logged out!"
    });
  },

  isAuthenticated: (req, res) => {
    res.status(200).send({
      isAuthenticated: req.isAuthenticated()
    });
  }
};
