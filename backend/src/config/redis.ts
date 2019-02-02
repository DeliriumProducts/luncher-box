import { RedisOptions } from 'ioredis';
import { REDIS_HOST, REDIS_PORT, ENV } from './env';

const db = (() => {
  switch (ENV) {
    default:
    case 'development':
      return 0;
    case 'production':
      return 1;
    case 'test':
      return 2;
  }
})();

const redisConfig: RedisOptions = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  db
};

export { redisConfig };
