import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import routes from './routes';
import database from './config/database';
import {
  appErrorHandler,
  genericErrorHandler,
  notFound
} from './middlewares/error.middleware';
import logger from './config/logger';

import swaggerUi from 'swagger-ui-express';
import swagger from './swagger/swagger3.0.json';

const app = express();
const host = process.env.APP_HOST;
const port = process.env.APP_PORT;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

database();
//

app.use(`/api`, routes());
app.use(appErrorHandler);
app.use(genericErrorHandler);
app.use(notFound);

app.listen(port, () => {
  logger.info(`Server started at ${host}:${port}/api-docs`);
});

export default app;
