import 'reflect-metadata';
import { dbConnection } from './connections';
import { useExpressServer } from 'routing-controllers';
import { useSocketServer } from 'socket-controllers';
import { app, ENV, initPassport, io, PORT, server } from './config';
import { authorizationChecker } from './utils';

const initServer = async () => {
  console.clear();
  /**
   * Establish database connection
   */
  await dbConnection();

  /**
   * Set up routing-controllers
   */
  useExpressServer(app, {
    classTransformer: false,
    defaultErrorHandler: false,
    controllers: [`${__dirname}/controllers/*.ts`],
    middlewares: [`${__dirname}/middlewares/*.ts`],
    authorizationChecker
  });

  /**
   * Set up socket-controllers
   */
  useSocketServer(io, {
    controllers: [`${__dirname}/controllers/*.io.ts`]
  });

  /**
   * Initialize passport configuration
   */
  initPassport();

  /**
   * Return server
   */
  return server;
};

const startServer = async () => {
  (await initServer()).listen(PORT, () => {
    console.log(`🥩 Luncher-box backend running on http://localhost:${PORT} in ${ENV}`);
  });
};

const stopServer = () => {
  server.close();
};

if (ENV !== 'test') {
  startServer();
}

export { initServer, startServer, stopServer };
