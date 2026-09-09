import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { ConnectMySql } from './config/db.js';

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