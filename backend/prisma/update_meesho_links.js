import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixMeeshoLinks() {
  console.log('Updating Meesho seller URLs to direct clean links...');

  const listings = await prisma.productListing.findMany({
    where: { sellerName: { contains: 'Meesho', mode: 'insensitive' } },
    include: { product: true }
  });

  for (const l of listings) {
    const productName = l.product?.name || 'earbuds';
    const cleanSearchUrl = `https://www.meesho.com/search?q=${encodeURIComponent(productName)}`;

    await prisma.productListing.update({
      where: { id: l.id },
      data: { sellerUrl: cleanSearchUrl }
    });
    console.log(`Updated Meesho URL for ${productName} -> ${cleanSearchUrl}`);
  }

  await prisma.$disconnect();
}

fixMeeshoLinks();
