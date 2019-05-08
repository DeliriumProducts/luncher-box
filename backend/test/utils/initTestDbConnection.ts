import { dbConnection as initDbConnection } from '../../src/connections';

const initTestDbConnection = async () => {
  let retries = 5;
  /**
   * Establish database connection
   */

  while (retries) {
    try {
      await initDbConnection(true, true);

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
};

initTestDbConnection();
