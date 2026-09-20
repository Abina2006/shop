import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixKurtiProduct() {
  console.log('=== Updating Womans Rayon Kurti With Palazzo in PostgreSQL ===\n');

  const kurtiProducts = await prisma.product.findMany({
    where: {
      name: { contains: 'Kurti', mode: 'insensitive' }
    }
  });

  for (const kp of kurtiProducts) {
    await prisma.product.update({
      where: { id: kp.id },
      data: {
        category: 'Fashion',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600',
        description: 'Women\'s premium rayon straight kurti with matching printed palazzo pants set, breathable fabric for daily & festive wear.'
      }
    });

    // Update listings
    await prisma.productListing.deleteMany({ where: { productId: kp.id } });
    await prisma.productListing.createMany({
      data: [
        { productId: kp.id, sellerName: 'Meesho', price: 449.00, currency: 'INR', rating: 4.4, reviewCount: 1840, sellerUrl: 'https://www.meesho.com/search?q=rayon+kurti+palazzo' },
        { productId: kp.id, sellerName: 'Flipkart', price: 599.00, currency: 'INR', rating: 4.3, reviewCount: 3200, sellerUrl: 'https://www.flipkart.com/search?q=rayon+kurti+palazzo' },
        { productId: kp.id, sellerName: 'Myntra', price: 699.00, currency: 'INR', rating: 4.6, reviewCount: 5400, sellerUrl: 'https://myntra.com/rayon-kurti-palazzo' },
        { productId: kp.id, sellerName: 'Amazon', price: 749.00, currency: 'INR', rating: 4.5, reviewCount: 2900, sellerUrl: 'https://www.amazon.in/s?k=rayon+kurti+palazzo' }
      ]
    });
    console.log(`✅ Updated: "${kp.name}" to Category: Fashion, Image: Indian Kurti, Meesho Price: ₹449!`);
  }

  await prisma.$disconnect();
}

fixKurtiProduct();
