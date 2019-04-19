import Redis from 'ioredis';
/**
 * For some reason this import has to be directly to `../config/redis` rather than `../config`
 * Otherwise it's undefined
 * ???
 */
import { redisConfig } from '../config/redis';

const redisConnection = new Redis(redisConfig);

export { redisConnection };
