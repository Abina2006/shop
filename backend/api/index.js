// Sanitize Neon DATABASE_URL automatically to fix pgbouncer port issues if needed without breaking pooler hostnames
if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL
    .replace(/:6543/g, '')
    .replace(/&pgbouncer=true/g, '')
    .replace(/\?pgbouncer=true/g, '');
}

import app from '../src/app.js';
export default app;

