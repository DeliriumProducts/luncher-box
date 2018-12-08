import express from 'express';
import configureExpress from './config/express';
import configureRoutes from './config/routes';

// create express app
const app = express();

// configure settings and routes
configureExpress(app);
configureRoutes(app);

export default app;