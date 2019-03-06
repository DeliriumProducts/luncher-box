import { ConnectionOptions } from 'typeorm';
import { DB_HOST, DB_PASS, DB_PORT, DB_USER, ENV, IS_DEV } from './env';
import { redisConfig } from './redis';

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
    synchronize: false,
    dropSchema: false,
    logging: false,
    entities: ['src/entities/*.ts'],
    cache: {
      type: 'ioredis',
      options: redisConfig
    }
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
    dropSchema: false,
    entities: ['src/entities/*.ts'],
    migrations: ['src/migration/*.ts'],
    cli: {
      migrationsDir: 'src/migration/*.ts'
    },
    cache: {
      type: 'ioredis',
      options: redisConfig
    }
  },
  test: {
    type: 'mariadb',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: 'luncherbox_test',
    dropSchema: false,
    synchronize: IS_DEV,
    logging: false,
    entities: ['src/entities/*.ts'],
    migrations: ['src/migration/*.ts'],
    cache: {
      type: 'ioredis',
      options: redisConfig
    }
  }
};

const dbConfig = dbConfigs[ENV];

export { dbConfig };
