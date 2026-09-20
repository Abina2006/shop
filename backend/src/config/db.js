import { PrismaClient } from '@prisma/client';

/**
 * Shared Prisma client with connection retry for Neon DB auto-suspend recovery.
 * Neon free tier suspends after 5 min of inactivity — this handles the cold-start delay.
 */
let prisma;

const clientOptions = {
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(clientOptions);
} else {
  // Prevent multiple clients during hot-reload in development
  if (!global.__prisma) {
    global.__prisma = new PrismaClient(clientOptions);
  }
  prisma = global.__prisma;
}

/**
 * Connects to the database with exponential back-off retry.
 * Neon DB may take up to 10s to wake from suspend.
 */
export async function connectWithRetry(maxRetries = 5, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
      return;
    } catch (err) {
      console.warn(`⚠️  DB connect attempt ${attempt}/${maxRetries} failed: ${err.message}`);
      if (attempt === maxRetries) {
        console.error('❌ Could not connect to database after all retries. Continuing without DB...');
        return; // Don't crash — let individual queries fail gracefully
      }
      await new Promise(r => setTimeout(r, delayMs * attempt));
    }
  }
}

export default prisma;
