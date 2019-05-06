import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';
import { useSocketServer } from 'socket-controllers';
import { app, BACKEND_URL, ENV, initPassport, io, PORT, server } from './config';
import { dbConnection as initDbConnection } from './connections';
import { authorizationChecker, createInitialAdmin } from './utils';

const initServer = async () => {
  console.clear();

  /**
   * Establish database connection
   */
  let retries = 5;

  while (retries) {
    try {
      await initDbConnection();

      /**
       * Break the loop if a connection has been initialized
       */
      break;
    } catch (error) {
      console.log(error);
      retries -= 1;
      console.log(`Retries left: ${retries}/5`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }

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
   * Create initial admin if there isn't one already
   */
  if (ENV !== 'test') {
    await createInitialAdmin();
  }

  return server;
};

const startServer = async () => {
  (await initServer()).listen(PORT, () => {
    console.log(`🥩 Luncher-box backend running on ${BACKEND_URL} in ${ENV}`);
  });
};

const stopServer = () => {
  server.close();
};

if (ENV !== 'test') {
  startServer();
}

export { initServer, startServer, stopServer };
