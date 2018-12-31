import * as dotenv from 'dotenv';

/**
 * Load env variables
 */
dotenv.config();

/**
 * DEV or PROD enviroment
 */
export const ENV = process.env.NODE_ENV || 'development';
export const IS_DEV = ENV === 'development';

/**
 * Server port
 */
export const PORT = Number(process.env.PORT) || 8000;

/**
 * Database name
 */
export const DB_NAME = process.env.DB_NAME || 'luncher-box';

/**
 * Database host and port
 */
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = Number(process.env.DB_PORT) || 3306;

/**
 * Database credentials
 */
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASS = process.env.DB_PASS || '';

/**
 * Redis host and port
 */
export const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

/**
 * Session secret
 */
export const SESSION_SECRET = process.env.SESSION_SECRET || 'example-secret';

/**
 * E-mail credentials (e-mail from)
 */
export const OWNER_EMAIL = process.env.OWNER_EMAIL || 'example-email@mail.com';
export const OWNER_PASS = process.env.OWNER_PASS || 'example-password';

/**
 * Restaurant owner credentials (e-mail TO)
 */
export const VERIFIER_EMAIL = process.env.VERIFIER_EMAIL || 'example-reciever@mail.com';

/**
 * Frontend url
 */
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export default {
  ENV,
  IS_DEV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  REDIS_HOST,
  REDIS_PORT,
  SESSION_SECRET,
  OWNER_EMAIL,
  OWNER_PASS,
  VERIFIER_EMAIL,
  FRONTEND_URL
};
