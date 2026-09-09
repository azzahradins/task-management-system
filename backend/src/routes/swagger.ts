import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from '../config/env.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const swaggerSpec = JSON.parse(
  fs.readFileSync(path.join(currentDirectory, '../docs/swagger.json'), 'utf-8'),
);
const swaggerServerUrl = new URL(env.SWAGGER_SERVER_URL)

// Swagger 2 uses host/schemes; OpenAPI 3 uses servers.
swaggerSpec.host = swaggerServerUrl.host
swaggerSpec.schemes = [swaggerServerUrl.protocol.replace(':', '')]
swaggerSpec.servers = [{ url: swaggerServerUrl.toString().replace(/\/$/, '') }]


export function setupSwagger(app: Express): void {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}