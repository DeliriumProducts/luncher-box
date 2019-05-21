import http from 'http';
import 'reflect-metadata';
import createSocketIoServer from 'socket.io';
import redisAdapter from 'socket.io-redis';
import { REDIS_HOST, REDIS_PORT } from '.';
import { app } from './express';

/**
 * Set up server
 */
const server = http.createServer(app);

/**
 * Pass the express instance / http server to socket.io
 */

const io = createSocketIoServer(server);
io.adapter(
  redisAdapter({
    host: REDIS_HOST,
    port: REDIS_PORT
  })
);

export { io, server };
