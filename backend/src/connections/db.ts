import { createConnection } from 'typeorm';
/**
 * For some reason this import has to be directly to `../config/typeorm` rather than `../config`
 * Otherwise it's undefined
 * ???
 */
import { dbConfig } from '../config/typeorm';

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

  return createConnection({
    ...dbConfig,
    name: 'default',
    dropSchema,
    synchronize
  });
};
