import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectWithRetry } from './config/db.js';
import { initPriceSyncCron } from './jobs/priceSync.cron.js';

const port = process.env.PORT || 5000;

async function startServer() {
  // Wake up the Neon DB (may be suspended on free tier)
  await connectWithRetry(5, 2000);

  const server = app.listen(port, () => {
    console.log(`🚀 ShopWise AI backend running on port ${port}`);
    // Initialize background cron scheduler
    initPriceSyncCron();
  });

  // Handle unhandled rejections — log but don't crash (DB reconnect may fix it)
  process.on('unhandledRejection', (err) => {
    console.error('⚠️  Unhandled rejection:', err.name, err.message);
    // Only crash for truly fatal errors
    if (err.code === 'ERR_HTTP_INVALID_STATUS_CODE') {
      server.close(() => process.exit(1));
    }
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught exception:', err.name, err.message);
    process.exit(1);
  });
}

startServer();
