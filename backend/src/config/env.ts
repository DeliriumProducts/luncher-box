import * as dotenv from "dotenv";

// load env variables
dotenv.config();

// dev or prod enviroment
export const ENV = process.env.NODE_ENV || 'development';

// server port
export const PORT = process.env.PORT || 8000;

// db ip
export const DB_IP = process.env.DB_IP || "example-ip:8080";

// session secret
export const SESSION_SECRET = process.env.SESSION_SECRET || "example-secret";

// email credentials (email FROM)
export const OWNER_EMAIL = process.env.OWNER_EMAIL || "example-email@mail.com";
export const OWNER_PASS = process.env.OWNER_PASS || "example-password";

// restaurant owner credentials (email TO)
export const VERIFIER_EMAIL = process.env.VERIFIER_EMAIL || "example-reciever@mail.com";

export default {
  ENV,
  PORT,
  DB_IP,
  SESSION_SECRET,
  OWNER_EMAIL,
  OWNER_PASS,
  VERIFIER_EMAIL
};
