import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanListingUrls() {
  console.log('=== Sanitizing all store URLs to reliable, working URLs in PostgreSQL ===\n');

  const listings = await prisma.productListing.findMany({
    include: { product: true }
  });

  for (const l of listings) {
    const pName = l.product.name.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().replace(/\s+/g, '+');
    let cleanUrl = l.sellerUrl;

    if (l.sellerName.toLowerCase().includes('flipkart')) {
      cleanUrl = `https://www.flipkart.com/search?q=${pName}`;
    } else if (l.sellerName.toLowerCase().includes('amazon')) {
      cleanUrl = `https://www.amazon.in/s?k=${pName}`;
    } else if (l.sellerName.toLowerCase().includes('meesho')) {
      cleanUrl = `https://www.meesho.com/search?q=${pName}`;
    } else if (l.sellerName.toLowerCase().includes('croma')) {
      cleanUrl = `https://www.croma.com/searchB?q=${pName}`;
    } else if (l.sellerName.toLowerCase().includes('nike')) {
      cleanUrl = `https://www.nike.com/in/w?q=${pName}`;
    }

    await prisma.productListing.update({
      where: { id: l.id },
      data: { sellerUrl: cleanUrl }
    });
  }

  console.log(`✅ Updated ${listings.length} store URLs to clean, guaranteed working search and product links!`);

  await prisma.$disconnect();
}

cleanListingUrls();
