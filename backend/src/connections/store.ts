// import { RedisStore } from './../config/express';
import createRedisStore from 'connect-redis';
import session from 'express-session';
import { redisConnection } from '.';

const RedisStore = createRedisStore(session);
export const store = new RedisStore({
  client: redisConnection as any
});
