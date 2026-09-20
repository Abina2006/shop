import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function deleteTest() {
  const pId = 'e2bbb4f1-f277-42ce-a70d-f4a5115dd890';
  const listings = await prisma.productListing.findMany({ where: { productId: pId } });
  for (const l of listings) {
    await prisma.review.deleteMany({ where: { listingId: l.id } }).catch(() => {});
    await prisma.priceHistory.deleteMany({ where: { listingId: l.id } }).catch(() => {});
  }
  await prisma.productListing.deleteMany({ where: { productId: pId } });
  await prisma.product.delete({ where: { id: pId } }).catch(() => {});
  console.log('Cleaned up test product.');
  await prisma.$disconnect();
}
deleteTest();
