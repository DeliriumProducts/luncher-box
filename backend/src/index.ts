import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { PORT, ENV, dbConfig, app, io, server } from './config';
import { useExpressServer } from 'routing-controllers';
import { useSocketServer } from 'socket-controllers';

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
    controllers: [`${__dirname}/controllers/*.ts`]
  });

  /**
   * Set up socket-controllers
   */
  useSocketServer(io, {
    controllers: [`${__dirname}/controllers/*.io.ts`]
  });

  /**
   * Start server
   */
  server.listen(PORT);
  console.log(`🥩 Luncher-box backend running on http://localhost:${PORT} in ${ENV}`);
};

startServer();

export default startServer;
