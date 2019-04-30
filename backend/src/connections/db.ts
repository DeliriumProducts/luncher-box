import { createConnection, getConnectionManager } from 'typeorm';
/**
 * For some reason this import has to be directly to `../config/typeorm` rather than `../config`
 * Otherwise it's undefined
 * ???
 */
import { dbConfig } from '../config/typeorm';

export const dbConnection = async (dropSchema?: boolean, synchronize?: boolean) => {
  let retries = 5;

  while (retries) {
    try {
      const connectionManager = getConnectionManager();
      if (!connectionManager.has('default')) {
        if (!dropSchema) {
          if (dbConfig.dropSchema) {
            dropSchema = dbConfig.dropSchema;
          } else {
            dropSchema = false;
          }
        }

        if (!synchronize) {
          if (dbConfig.synchronize) {
            synchronize = dbConfig.synchronize;
          } else {
            synchronize = false;
          }
        }

        return createConnection({
          ...dbConfig,
          name: 'default',
          dropSchema,
          synchronize
        });
      } else {
        return connectionManager.get('default');
      }
    } catch (error) {
      console.log(error);
      retries -= 1;
      console.log(`Retries left: ${retries}/5`);
      // wait 5 seconds
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  return undefined;
};
