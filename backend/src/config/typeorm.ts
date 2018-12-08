import { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } from "./env";
import { ConnectionOptions } from "typeorm";

const options: ConnectionOptions = {
  type: "mariadb",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  synchronize: true,
  logging: false
};

export default options;
