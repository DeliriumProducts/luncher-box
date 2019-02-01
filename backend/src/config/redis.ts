import Redis, { RedisOptions } from 'ioredis';
import { REDIS_HOST, REDIS_PORT } from './env';

const redisConfig: RedisOptions = {
  host: REDIS_HOST,
  port: REDIS_PORT
};

export { redisConfig };
