import { createConnection, getConnection } from 'typeorm';
import { dbConfig } from '../config';

export const dbConnection = async (dropSchema?: boolean, synchronize?: boolean) => {
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

  try {
    return getConnection('default');
  } catch (e) {
    return await createConnection({
      ...dbConfig,
      name: 'default',
      dropSchema,
      synchronize
    });
  }
};
