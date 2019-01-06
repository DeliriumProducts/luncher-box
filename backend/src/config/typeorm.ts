import { ConnectionOptions } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER, IS_DEV } from './env';

const dbConfig: ConnectionOptions = {
  type: 'mariadb',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  charset: 'UTF8_GENERAL_CI',
  synchronize: IS_DEV,
  logging: false,
  entities: ['src/entities/*.ts']
};

export { dbConfig };
