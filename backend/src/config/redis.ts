import { RedisOptions } from 'ioredis';
import { ENV, REDIS_HOST, REDIS_PORT } from './env';

let db: 0 | 1 | 2;

switch (ENV) {
  default:
    db = 0;
    break;
/* istanbul ignore next */
  case 'development':
    db = 0;
    break;
/* istanbul ignore next */
  case 'production':
    db = 1;
    break;
  case 'test':
    db = 2;
    break;
}

export const redisConfig: RedisOptions = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  db
};
