import { ConnectionOptions } from 'typeorm';
import { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } from './env';

const dbConfig: ConnectionOptions = {
  type: 'mariadb',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  synchronize: true, // don't use in production!
  logging: false,
  entities: ['src/entities/*.ts']
};

export { dbConfig };
