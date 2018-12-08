import * as express from 'express';
const app = express();

import expressConfig from './config/express'; 
import routesConfig from './config/routes';
import passportConfig from './config/passport'; 

expressConfig(app);
routesConfig(app);
passportConfig();

export default app;
