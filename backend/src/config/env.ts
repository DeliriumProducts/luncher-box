import * as dotenv from "dotenv";

// load env variables
dotenv.config();

// dev or prod enviroment
export const ENV = process.env.NODE_ENV || "development";

// server port
export const PORT = Number(process.env.PORT) || 8000;

// db name
export const DB_NAME = process.env.DB_NAME || "luncher-box";

// db host and port
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = Number(process.env.DB_PORT) || 3306;

// db user and pass
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASS = process.env.DB_PASS || "";

// session secret
export const SESSION_SECRET = process.env.SESSION_SECRET || "example-secret";

// email credentials (email FROM)
export const OWNER_EMAIL = process.env.OWNER_EMAIL || "example-email@mail.com";
export const OWNER_PASS = process.env.OWNER_PASS || "example-password";

// restaurant owner credentials (email TO)
export const VERIFIER_EMAIL =
  process.env.VERIFIER_EMAIL || "example-reciever@mail.com";

export default {
  ENV,
  PORT,
  DB_HOST,
  DB_USER,
  DB_PASS,
  SESSION_SECRET,
  OWNER_EMAIL,
  OWNER_PASS,
  VERIFIER_EMAIL
};
