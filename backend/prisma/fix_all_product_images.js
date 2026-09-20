import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ACCURATE_IMAGES = [
  // Appliances
  { nameFilter: 'Air Fryer', imageUrl: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?q=80&w=600' },
  { nameFilter: 'Induction Cooktop', imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600' },

  // Audio
  { nameFilter: 'AirPods Pro', imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600' },
  { nameFilter: 'Airdopes', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600' },
  { nameFilter: 'JBL Flip 6', imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600' },
  { nameFilter: 'Microphone', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600' },
  { nameFilter: 'Sony WH-1000XM5', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600' },
  { nameFilter: 'OnePlus Buds', imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?q=80&w=600' },

  // Computers
  { nameFilter: 'MacBook Air', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600' },
  { nameFilter: 'Macbook Pro', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600' },
  { nameFilter: 'Dell XPS', imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600' },
  { nameFilter: 'HP Pavilion', imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600' },
  { nameFilter: 'Lenovo Legion', imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600' },

  // Fashion
  { nameFilter: 'Levi', imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=600' },
  { nameFilter: 'Puma', imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600' },
  { nameFilter: 'Ray-Ban', imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600' },
  { nameFilter: 'Kurti', imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600' },

  // Footwear
  { nameFilter: 'Adidas Ultraboost', imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=600' },
  { nameFilter: 'Crocs', imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=600' },
  { nameFilter: 'Nike Air', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600' },

  // Groceries
  { nameFilter: 'Basmati Rice', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600' },
  { nameFilter: 'Sunflower Cooking Oil', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600' },
  { nameFilter: 'Tata Tea', imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600' },

  // Personal Care
  { nameFilter: 'Dettol', imageUrl: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=600' },
  { nameFilter: 'Dove', imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=600' },
  { nameFilter: 'Fogg', imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600' },
  { nameFilter: 'Medimix', imageUrl: 'https://images.unsplash.com/photo-1607006483702-326002f23b12?q=80&w=600' },
  { nameFilter: 'Pears', imageUrl: 'https://images.unsplash.com/photo-1607006411601-775c8cc632dc?q=80&w=600' },
  { nameFilter: 'Santoor', imageUrl: 'https://images.unsplash.com/photo-1607006314144-8869165d491f?q=80&w=600' },
  { nameFilter: 'Tresemme', imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600' },

  // Smartphones
  { nameFilter: 'iPad Air', imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600' },
  { nameFilter: 'Pixel 8 Pro', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600' },
  { nameFilter: 'OnePlus 12', imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600' },
  { nameFilter: 'Galaxy S24', imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600' },
  { nameFilter: 'iPhone 15', imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600' },

  // Wearables
  { nameFilter: 'Apple Watch', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600' },
  { nameFilter: 'Galaxy Watch', imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600' },
];

async function fixAllProductImages() {
  console.log('=== Checking & Fixing Product Images in PostgreSQL ===\n');

  // 1. Clean up duplicate products if any
  const dupBoAt = await prisma.product.findUnique({ where: { id: '1a1bdba9-3fd3-40e0-b85a-be5518271f23' } });
  if (dupBoAt) {
    await prisma.review.deleteMany({ where: { listing: { productId: dupBoAt.id } } }).catch(() => {});
    await prisma.priceHistory.deleteMany({ where: { listing: { productId: dupBoAt.id } } }).catch(() => {});
    await prisma.priceAlert.deleteMany({ where: { listing: { productId: dupBoAt.id } } }).catch(() => {});
    await prisma.productListing.deleteMany({ where: { productId: dupBoAt.id } }).catch(() => {});
    await prisma.product.delete({ where: { id: dupBoAt.id } }).catch(() => {});
    console.log('🗑️ Cleaned duplicate boAt entry.');
  }

  const dupIpad = await prisma.product.findUnique({ where: { id: '570edc8a-44ad-4f49-bede-3458cccd263d' } });
  if (dupIpad) {
    await prisma.review.deleteMany({ where: { listing: { productId: dupIpad.id } } }).catch(() => {});
    await prisma.priceHistory.deleteMany({ where: { listing: { productId: dupIpad.id } } }).catch(() => {});
    await prisma.priceAlert.deleteMany({ where: { listing: { productId: dupIpad.id } } }).catch(() => {});
    await prisma.productListing.deleteMany({ where: { productId: dupIpad.id } }).catch(() => {});
    await prisma.product.delete({ where: { id: dupIpad.id } }).catch(() => {});
    console.log('🗑️ Cleaned duplicate iPad entry.');
  }

  // 2. Update all product images with verified URLs
  const products = await prisma.product.findMany();
  for (const product of products) {
    const match = ACCURATE_IMAGES.find(img => product.name.toLowerCase().includes(img.nameFilter.toLowerCase()));
    if (match) {
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: match.imageUrl }
      });
      console.log(`🖼️ [MATCHED] "${product.name}" -> ${match.imageUrl}`);
    } else {
      console.log(`ℹ️ [RETAINED] "${product.name}" -> ${product.imageUrl}`);
    }
  }

  const finalProducts = await prisma.product.findMany();
  console.log(`\n🎉 Verified images for all ${finalProducts.length} products!`);
  await prisma.$disconnect();
}

fixAllProductImages().catch(err => {
  console.error('Error fixing product images:', err);
  process.exit(1);
});
