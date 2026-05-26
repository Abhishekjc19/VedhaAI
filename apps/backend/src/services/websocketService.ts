import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { logger } from '../utils/logger';
import { assignmentService } from '../services/assignmentService';

export function initializeWebSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('join-assignment', (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`);
      logger.info(`Client ${socket.id} joined assignment ${assignmentId}`);
    });

    socket.on('leave-assignment', (assignmentId: string) => {
      socket.leave(`assignment:${assignmentId}`);
      logger.info(`Client ${socket.id} left assignment ${assignmentId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

let ioInstance: SocketIOServer | null = null;

export function setIOInstance(io: SocketIOServer) {
  ioInstance = io;
}

export function getIOInstance(): SocketIOServer {
  if (!ioInstance) {
    throw new Error('WebSocket not initialized');
  }
  return ioInstance;
}

export function notifyGenerationProgress(assignmentId: string, data: any) {
  if (ioInstance) {
    ioInstance.to(`assignment:${assignmentId}`).emit('generation-progress', data);
  }
}

export function notifyGenerationComplete(assignmentId: string, paperId: string) {
  if (ioInstance) {
    ioInstance.to(`assignment:${assignmentId}`).emit('generation-complete', {
      paperId,
      timestamp: new Date(),
    });
  }
}

export function notifyGenerationError(assignmentId: string, error: string) {
  if (ioInstance) {
    ioInstance.to(`assignment:${assignmentId}`).emit('generation-error', {
      error,
      timestamp: new Date(),
    });
  }
}
