import { ConnectionOptions } from 'typeorm';
import { DB_HOST, DB_PASS, DB_PORT, DB_USER, ENV, IS_DEV } from './env';

interface DbConfigs {
  development: ConnectionOptions;
  production: ConnectionOptions;
  test: ConnectionOptions;
  [key: string]: ConnectionOptions;
}

const dbConfigs: DbConfigs = {
  development: {
    type: 'mariadb',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: 'luncherbox_development',
    synchronize: IS_DEV,
    logging: false,
    entities: ['src/entities/*.ts']
  },
  production: {
    type: 'mariadb',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: 'luncherbox_production',
    synchronize: IS_DEV,
    logging: false,
    entities: ['src/entities/*.ts'],
    migrations: ['src/migration/*.ts'],
    cli: {
      migrationsDir: 'src/migration/*.ts'
    }
  },
  test: {
    type: 'mariadb',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: 'luncherbox_test',
    dropSchema: true,
    synchronize: IS_DEV,
    logging: false,
    entities: ['src/entities/*.ts'],
    migrations: ['src/migration/*.ts']
  }
};

const dbConfig = dbConfigs[ENV];

export { dbConfig };
