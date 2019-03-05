import https from 'https';
import 'reflect-metadata';
import createSocketIoServer from 'socket.io';
import { app } from './express';

/**
 * Set up server
 */
const server = https.createServer(app);

/**
 * Pass the express instance / http server to socket.io
 */
const io = createSocketIoServer(server);

export { io, server };
