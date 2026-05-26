import { useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export function useSocket() {
  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socket.on('connect', () => {
        console.log('Socket connected');
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }

    return () => {
      // Don't close on unmount to maintain connection
    };
  }, []);

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function joinAssignment(assignmentId: string) {
  if (socket) {
    socket.emit('join-assignment', assignmentId);
  }
}

export function leaveAssignment(assignmentId: string) {
  if (socket) {
    socket.emit('leave-assignment', assignmentId);
  }
}

export function onGenerationProgress(callback: (data: any) => void) {
  if (socket) {
    socket.on('generation-progress', callback);
  }
}

export function onGenerationComplete(callback: (data: any) => void) {
  if (socket) {
    socket.on('generation-complete', callback);
  }
}

export function onGenerationError(callback: (data: any) => void) {
  if (socket) {
    socket.on('generation-error', callback);
  }
}
