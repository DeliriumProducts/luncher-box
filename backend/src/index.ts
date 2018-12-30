import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { PORT, ENV, dbConfig, initPassport, app, io, server } from './config';
import { useExpressServer } from 'routing-controllers';
import { useSocketServer } from 'socket-controllers';
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

export default startServer;
