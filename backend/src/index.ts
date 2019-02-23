import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';
import { useSocketServer } from 'socket-controllers';
import { app, ENV, initPassport, io, PORT, server } from './config';
import { dbConnection as initDbConnection } from './connections';
import { authorizationChecker } from './utils';

const initServer = async () => {
  console.clear();
  /**
   * Establish database connection
   */
  await initDbConnection();

  /**
   * Set up routing-controllers
   */
  useExpressServer(app, {
    classTransformer: false,
    defaultErrorHandler: false,
    controllers: [`${__dirname}/controllers/*.*`],
    middlewares: [`${__dirname}/middlewares/*.*`],
    authorizationChecker
  });

  /**
   * Set up socket-controllers
   */
  useSocketServer(io, {
    controllers: [`${__dirname}/controllers/*.io.*`]
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
