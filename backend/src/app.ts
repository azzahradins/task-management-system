import express, { type Express } from 'express';
import apiRouter from './routes';

const app: Express = express();

app.use(express.json());

// Define routes here
app.use('/api', apiRouter);

export default app;