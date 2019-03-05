import Redis from 'ioredis';
import { redisConfig } from '../config';

const redisConnection = new Redis(redisConfig);

export { redisConnection };
