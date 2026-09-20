import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndFixAllProductImages() {
  console.log('🔍 Checking product catalog for image and category mismatches...\n');

  const products = await prisma.product.findMany();

  const REAL_IMAGE_MAP = {
    // Footwear / Sneakers / Shoes
    shoe: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
    sneaker: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
    running: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
    footwear: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',

    // Kurti / Anarkali / Dress
    kurta: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800',
    anarkali: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800',
    dress: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800',

    // Jeans & Pants
    jeans: 'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=800',
    levis: 'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=800',

    // Audio / Earbuds / Headphones
    airdopes: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800',
    earbud: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800',
    headphones: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800',

    // Phones
    galaxy: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800',
    iphone: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800',
    oneplus: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800',

    // Laptops
    macbook: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800',
    pavilion: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800'
  };

  let fixed = 0;

  for (const p of products) {
    console.log(`Product: "${p.name}" | Current Category: ${p.category} | Current Image: ${p.imageUrl}`);

    const nameLower = p.name.toLowerCase();
    let newCategory = p.category;
    let newImageUrl = p.imageUrl;

    // Check Footwear
    if (nameLower.includes('shoe') || nameLower.includes('sneaker') || nameLower.includes('footwear') || nameLower.includes('running')) {
      newCategory = 'Footwear';
      newImageUrl = REAL_IMAGE_MAP.shoe;
    }
    // Check Kurta / Anarkali / Dress
    else if (nameLower.includes('kurta') || nameLower.includes('anarkali') || nameLower.includes('dress') || nameLower.includes('saree')) {
      newCategory = 'Fashion';
      newImageUrl = REAL_IMAGE_MAP.kurta;
    }
    // Check Jeans
    else if (nameLower.includes('jean') || nameLower.includes('denim')) {
      newCategory = 'Fashion';
      newImageUrl = REAL_IMAGE_MAP.jeans;
    }

    if (newCategory !== p.category || newImageUrl !== p.imageUrl) {
      await prisma.product.update({
        where: { id: p.id },
        data: {
          category: newCategory,
          imageUrl: newImageUrl
        }
      });
      console.log(`  👉 UPDATED "${p.name}": Category -> ${newCategory} | Image -> ${newImageUrl}`);
      fixed++;
    }
  }

  console.log(`\n🎉 Audited ${products.length} products. Fixed ${fixed} category/image mismatches.`);
  await prisma.$disconnect();
}

checkAndFixAllProductImages().catch(console.error);
