import mysql from 'mysql2/promise';
import { env } from './env';

export const db = mysql.createPool({
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT, 10),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
})

export const ConnectMySql = async () => {
    try {
        const connection = await db.getConnection();
        console.log('MySQL database - OK');
        connection.release();
    } catch (error) { 
        console.error('Error connecting to the database:', error);
        throw error;
    }
}