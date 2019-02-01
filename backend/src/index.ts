import 'reflect-metadata';
import { dbConnection } from './connections';
import { useExpressServer } from 'routing-controllers';
import { useSocketServer } from 'socket-controllers';
import { dbConfig, app, ENV, initPassport, io, PORT, server } from './config';
import { authorizationChecker } from './utils';

const startServer = async () => {
  console.clear();
  /**
   * Establish database connection
   */
  const connection = await dbConnection();

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
   * Start server
   */
  server.listen(PORT);
  console.log(`🥩 Luncher-box backend running on http://localhost:${PORT} in ${ENV}`);
};

startServer();

export default {
  startServer,
  app
};
