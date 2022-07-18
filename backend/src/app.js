import express from 'express';
import morgan from 'morgan';

import logger from './logger';
import apiRoutes from './api/api-routes';
import errorHandler from './middlewares/error-handler';

const app = express();

app.use(morgan('combined', { stream: logger.stream }));

app.use('/api', apiRoutes);

app.use(errorHandler);

export default app;
