import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pkg;

async function checkNativePg() {
  console.log('🐘 QUERYING POSTGRESQL NATIVE TABLES & COUNTS (shopwiseAI):\n');
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name NOT LIKE '_prisma%'
      ORDER BY table_name;
    `);

    console.log(`Found ${res.rows.length} PostgreSQL tables:`);
    let totalRows = 0;

    for (const row of res.rows) {
      const tableName = row.table_name;
      const countRes = await client.query(`SELECT COUNT(*) FROM "${tableName}"`);
      const count = parseInt(countRes.rows[0].count, 10);
      totalRows += count;
      console.log(`  • ${tableName.padEnd(28)} -> ${count} rows`);
    }

    console.log('\n====================================================');
    console.log(`✅ TOTAL RECORDS STORED IN POSTGRESQL: ${totalRows}`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ Native PG query error:', err.message);
  } finally {
    await client.end();
  }
}

checkNativePg();
