import { dbConnection } from '../../src/connections';

dbConnection(true, true).then(() => process.exit(1));
