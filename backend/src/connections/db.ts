import { createConnection, getConnection } from 'typeorm';
import { dbConfig } from '../config';

export const dbConnection = async (dropAndSync: boolean = false) => {
  try {
    return getConnection('default');
  } catch (e) {
    return await createConnection({
      ...dbConfig,
      name: 'default',
      dropSchema: dropAndSync,
      synchronize: dropAndSync
    });
  }
};
