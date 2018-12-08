import * as path from "path";
require("dotenv").config();

export default {
  rootFolder: path.normalize(path.join(__dirname, "/../")),
  dbUrl: process.env.DB_IP
};
