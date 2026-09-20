import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function deleteDuplicateBoat() {
  const dup = await prisma.product.findUnique({
    where: { id: '1bd8329d-611a-4db7-b4f9-3d0c55ff499a' }
  });

  if (dup) {
    console.log(`Deleting duplicate boAt product: "${dup.name}" (ID: ${dup.id})`);
    // Delete listings (and cascading relations)
    const listings = await prisma.productListing.findMany({ where: { productId: dup.id } });
    for (const l of listings) {
      await prisma.review.deleteMany({ where: { listingId: l.id } }).catch(() => {});
      await prisma.priceHistory.deleteMany({ where: { listingId: l.id } }).catch(() => {});
      await prisma.priceAlert.deleteMany({ where: { listingId: l.id } }).catch(() => {});
    }
    await prisma.productListing.deleteMany({ where: { productId: dup.id } });
    await prisma.wishlist.deleteMany({ where: { productId: dup.id } }).catch(() => {});
    await prisma.platformRecommendation.deleteMany({ where: { productId: dup.id } }).catch(() => {});
    await prisma.product.delete({ where: { id: dup.id } });
    console.log('✅ Duplicate deleted cleanly!');
  } else {
    console.log('No duplicate found.');
  }

  await prisma.$disconnect();
}

deleteDuplicateBoat().catch(console.error);
