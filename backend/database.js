import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// PostgreSQL pool using .env parameters or connectionString
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'shopwiseAI',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ...(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {})
});

// Handle idle pool resets silently
pool.on('error', (err) => {
  if (err.message.includes('closed') || err.message.includes('terminated')) {
    return;
  }
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

// Auto-test PostgreSQL connection
pool.connect()
  .then((client) => {
    console.log('PostgreSQL connected successfully');
    client.release();
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection failed:', err.message);
  });

export default pool;
