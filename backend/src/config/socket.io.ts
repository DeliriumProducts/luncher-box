import 'reflect-metadata';
import { useSocketServer } from 'socket-controllers';
import createSocketIoServer from 'socket.io';
import { app } from './express';
import http from 'http';

/**
 * Set up server
 */
const server = http.createServer(app);

/**
 * Pass the express instance / http server to socket.io
 */
const io = createSocketIoServer(server);

export { io, server };
