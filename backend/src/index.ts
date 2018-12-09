import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { PORT, ENV } from './config/env';
import dbConfig from './config/typeorm';
import app from './config/express';

const startServer = async () => {
  // establish db connection
  const connection: Connection = await createConnection(dbConfig);
  app.listen(PORT);
  console.log(
    `🥩 Luncher-box backend running on http://localhost:${PORT} in ${ENV}`
  );
};

startServer();

export default startServer;
