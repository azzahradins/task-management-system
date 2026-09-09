import express, { type Express } from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { env } from './config/env.js';

import { setupSwagger } from './routes/swagger.js';

const app: Express = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
setupSwagger(app);

// Define routes here
app.use('/api', apiRouter);

export default app;