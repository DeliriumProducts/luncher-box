import { ENV } from './../config/env';
import { dbConfig } from '../config';
import { Connection, createConnection, createConnections } from 'typeorm';

export const dbConnection = (() => {
  /**
   * https://stackoverflow.com/questions/49798540/how-to-export-a-variable-that-takes-its-value-from-an-async-function
   * (Prevent making new connections every time you import the connection)
   */
  let cachedConnection: Connection[] | undefined;

  return async () => {
    if (!cachedConnection) {
      cachedConnection = await createConnections(dbConfig);

      // await cachedConnection.query(
      //   'CREATE DATABASE IF NOT EXISTS ? CHARACTER SET UTF8 COLLATE UTF8_GENERAL_CI',
      //   [dbName]
      // );
    }

    return dbConnection;
  };
})();
