import express from 'express';
import morgan from 'morgan';

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { swaggerSettings } from './config';

import logger from './logger';
import apiRoutes from './api/api-routes';
import authRoutes from './auth/auth-routes';
import errorHandler from './middlewares/error-handler';

const app = express();
const specs = swaggerJsDoc(swaggerSettings);

app.use(morgan('combined', { stream: logger.stream }));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

app.use(errorHandler);

export default app;
