import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';
import { useSocketServer } from 'socket-controllers';
import { Connection, createConnection } from 'typeorm';
import { app, dbConfig, ENV, initPassport, io, PORT, server } from './config';
import { authorizationChecker } from './utils';

const startServer = async () => {
  console.clear();
  /**
   * Establish database connection
   */
  const connection: Connection = await createConnection(dbConfig);

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
   * Start server
   */
  server.listen(PORT);
  console.log(`🥩 Luncher-box backend running on http://localhost:${PORT} in ${ENV}`);
};

startServer();

export default startServer;
