import { REDIS_HOST, REDIS_PORT } from './env';
import Redis from 'ioredis';

const redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT
});

export { redisClient };
