import { PrismaClient } from '@prisma/client';

const poolerUrl = 'postgresql://neondb_owner:npg_Ouwft9dcey4z@ep-lively-night-ae31t8jj-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';
const directUrl = 'postgresql://neondb_owner:npg_Ouwft9dcey4z@ep-lively-night-ae31t8jj.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function test() {
  console.log('Testing direct endpoint...');
  try {
    const p1 = new PrismaClient({ datasources: { db: { url: directUrl } } });
    const c1 = await p1.product.count();
    console.log('Direct endpoint SUCCESS, count:', c1);
    await p1.$disconnect();
  } catch(e) {
    console.error('Direct failed:', e.message);
  }

  console.log('Testing pooler endpoint...');
  try {
    const p2 = new PrismaClient({ datasources: { db: { url: poolerUrl } } });
    const c2 = await p2.product.count();
    console.log('Pooler endpoint SUCCESS, count:', c2);
    await p2.$disconnect();
  } catch(e) {
    console.error('Pooler failed:', e.message);
  }
}

test();
