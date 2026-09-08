import http from 'http';
import app from './app';
import { env } from './config/env';
import { ConnectMySql } from './config/db';

const PORT = env.NODE_PORT;

async function startServer() {
    try {
        await ConnectMySql();
        const server = http.createServer(app);
        server.listen(PORT, () => {
            console.log(`Node Server - OK | Listening on port ${PORT}`);
        });
    } catch {
        process.exit(1);
    }
}

startServer();