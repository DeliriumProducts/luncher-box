import { ConnectionOptions } from 'typeorm';
import { DB_HOST, DB_PASS, DB_PORT, DB_USER, IS_DEV, ENV } from './env';

const dbConfig: ConnectionOptions[] = [
  {
    name: 'development',
    type: 'mariadb',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: 'luncherboxDev',
    synchronize: IS_DEV,
    logging: false,
    entities: ['src/entities/*.ts']
  },
  {
    name: 'production',
    type: 'mariadb',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: 'luncherboxProd',
    synchronize: IS_DEV,
    logging: false,
    entities: ['src/entities/*.ts']
  },
  {
    name: 'test',
    type: 'mariadb',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: 'luncherboxTest',
    synchronize: false,
    logging: false,
    entities: ['src/entities/*.ts']
  }
];

export { dbConfig };
