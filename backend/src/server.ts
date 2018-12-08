import app from "./app";
import { PORT, ENV } from './config/env';

// start server
const server = app.listen(PORT, () => {
  console.clear();
  console.log(
    `🥩 Luncher-box backend running on http://localhost:${PORT} in ${ENV}`
  );
});

export default server;
