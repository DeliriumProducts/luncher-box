import { dbConnection } from '../../src/connections';

dbConnection(true).then(() => process.exit());
