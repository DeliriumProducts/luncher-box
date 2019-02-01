import * as dotenv from 'dotenv';

/**
 * Load env variables
 */
dotenv.config({
  path: `${__dirname}../../.env`
});

/**
 * Backend url
 */
export const BACKEND_URL = process.env.BACKEND_URL;

export default {
  BACKEND_URL
};
