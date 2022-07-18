import express from 'express';
import morgan from 'morgan';

import logger from './logger';
import apiRoutes from './api/api-routes';

const app = express();

app.use(morgan('combined', { stream: logger.stream }));

app.use('/api', apiRoutes);

export default app;
