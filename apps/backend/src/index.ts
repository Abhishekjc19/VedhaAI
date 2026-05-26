import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';

import { connectDatabase, connectRedis, disconnectAll } from './config/database';
import { initializeQueues } from './services/queueService';
import { initializeWebSocket, setIOInstance } from './services/websocketService';
import assignmentRoutes from './routes/assignmentRoutes';
import { logger } from './utils/logger';
import { errorHandler, requestLogger, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(requestLogger);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api', assignmentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Initialize WebSocket
const io = initializeWebSocket(httpServer);
setIOInstance(io);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
async function start() {
  try {
    await connectDatabase();
    
    // Try to connect to Redis, but don't fail if unavailable
    try {
      await connectRedis();
      initializeQueues();
    } catch (error) {
      logger.warn('Redis not available - background jobs will be disabled:', error);
    }

    const port = parseInt(process.env.PORT || '3001');
    httpServer.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      httpServer.close(() => {
        logger.info('HTTP server closed');
        disconnectAll();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
