import "reflect-metadata";
import { createConnection } from "typeorm";
import { PORT, ENV } from "./config/env";
import dbConfig from "./config/typeorm";
import { User } from "./entity/User";
import app from "./config/express";

// establish db connection
createConnection(dbConfig) 
  .then(async connection => {

    // start server
    app.listen(PORT);
    console.clear();
    console.log(
      `🥩 Luncher-box backend running on http://localhost:${PORT} in ${ENV}`
    );
  })
  .catch(error => console.log(error));
