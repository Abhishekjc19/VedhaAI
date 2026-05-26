import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';
import { supabase } from './supabase';

let redisClient: RedisClientType;

export async function connectDatabase() {
  try {
    // Test Supabase connection with a simple query
    const { error } = await supabase.from('users').select('id').limit(1);
    
    if (error) {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }
    
    logger.info('Supabase connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}

export async function connectRedis() {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          // Stop retrying after 5 failed attempts
          if (retries > 5) {
            logger.warn('Redis connection failed - max retries reached, disabling background jobs');
            return new Error('Redis max retries reached');
          }
          return retries * 100;
        }
      }
    });
    
    redisClient.on('error', (err) => {
      // Silently ignore redis errors in dev mode
      if (process.env.NODE_ENV === 'production') {
        logger.error('Redis error:', err);
      }
    });
    redisClient.on('connect', () => logger.info('Redis connected'));
    
    await redisClient.connect();
  } catch (error) {
    logger.warn('Redis connection failed:', error);
    // Don't throw - let the app continue without Redis
  }
}

export function getSupabase() {
  return supabase;
}

export function getRedisClient(): RedisClientType {
  if (!redisClient) throw new Error('Redis not connected');
  return redisClient;
}

export async function disconnectAll() {
  if (redisClient) await redisClient.quit();
}
