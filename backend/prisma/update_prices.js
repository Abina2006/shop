import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updatePrices() {
  console.log('Updating seller listing prices in PostgreSQL...');

  const product = await prisma.product.findFirst({
    where: { name: { contains: 'Airdopes', mode: 'insensitive' } },
    include: { listings: true }
  });

  if (product) {
    for (const listing of product.listings) {
      let newPrice = 799;
      if (listing.sellerName.toLowerCase().includes('flipkart')) {
        newPrice = 999;
      } else if (listing.sellerName.toLowerCase().includes('amazon')) {
        newPrice = 899;
      } else if (listing.sellerName.toLowerCase().includes('croma')) {
        newPrice = 1099;
      }

      await prisma.productListing.update({
        where: { id: listing.id },
        data: { price: newPrice }
      });
      console.log(`Updated ${product.name} on ${listing.sellerName} -> ₹${newPrice}`);
    }
  }

  await prisma.$disconnect();
}

updatePrices();
