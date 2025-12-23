import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const poolConfig: pg.PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
};

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

export const db = drizzle(pool, { schema });

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      const isRetryable = 
        error.code === 'EAI_AGAIN' || 
        error.code === 'ENOTFOUND' ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.message?.includes('EAI_AGAIN') ||
        error.message?.includes('getaddrinfo');
      
      if (isRetryable && attempt < maxRetries) {
        console.log(`Database connection attempt ${attempt} failed (${error.code || error.message}). Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      } else {
        throw error;
      }
    }
  }
  
  throw lastError;
}
