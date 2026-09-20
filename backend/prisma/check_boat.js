import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkBoat() {
  const prods = await prisma.product.findMany({
    where: { name: { contains: 'Airdopes', mode: 'insensitive' } },
    include: { listings: true }
  });

  for (const p of prods) {
    console.log(`Product ID: ${p.id} | Name: "${p.name}"`);
    for (const l of p.listings) {
      console.log(`  Listing ID: ${l.id} | Seller: ${l.sellerName} | Price: ₹${l.price}`);
    }
  }
  await prisma.$disconnect();
}
checkBoat();
