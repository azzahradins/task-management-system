import fs from 'node:fs'
import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const swaggerSpec = JSON.parse(
  fs.readFileSync("./src/docs/swagger.json", "utf-8"),
);


export function setupSwagger(app: Express): void {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}