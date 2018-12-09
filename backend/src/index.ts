import { CategoryController } from './controllers/CategoryController';
import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { PORT, ENV } from './config/env';
import dbConfig from './config/typeorm';
import app from './config/express';

const startServer = async () => {
  console.clear();

  // establish db connection
  const connection: Connection = await createConnection(dbConfig);

  // start listening
  app.listen(PORT);
  console.log(
    `🥩 Luncher-box backend running on http://localhost:${PORT} in ${ENV}`
  );
};

startServer();

export default startServer;
