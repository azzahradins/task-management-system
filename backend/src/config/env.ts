import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    NODE_PORT: z.string().default('3000'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    SWAGGER_SERVER_URL: z.string().url().default('http://localhost:3000'),
    
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
    JWT_DURATION: z.coerce.number().int().positive()
})

const parsedEnv = () => {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.error('Invalid environment variables:', result.error.format());
        process.exit(1);
    }
    return result.data;
}

export const env = parsedEnv();