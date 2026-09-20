import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSoapsAndPersonalCare() {
  console.log('=== Adding Real Soaps and Personal Care Products to PostgreSQL ===\n');

  // 1. Dove Cream Beauty Bathing Bar
  const dove = await prisma.product.create({
    data: {
      name: 'Dove Cream Beauty Bathing Bar (Pack of 3 x 100g)',
      category: 'Personal Care',
      brand: 'Dove',
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-00976585ea15?q=80&w=600',
      description: 'Dove Beauty Bar with 1/4th moisturizing cream, soft on skin, hypoallergenic and dermatologist recommended.'
    }
  });

  await prisma.productListing.createMany({
    data: [
      { productId: dove.id, sellerName: 'Meesho', sellerUrl: 'https://meesho.com/search?q=dove+soap', price: 145.00, currency: 'INR', rating: 4.5, reviewCount: 890 },
      { productId: dove.id, sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/search?q=dove+soap', price: 175.00, currency: 'INR', rating: 4.4, reviewCount: 2300 },
      { productId: dove.id, sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=dove+soap', price: 199.00, currency: 'INR', rating: 4.6, reviewCount: 4500 }
    ]
  });

  // 2. Dettol Original Germ Protection Bathing Soap
  const dettol = await prisma.product.create({
    data: {
      name: 'Dettol Original Germ Protection Bathing Soap (Pack of 4 x 125g)',
      category: 'Personal Care',
      brand: 'Dettol',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600',
      description: 'Dettol Original Bathing Soap protects from 100 illness causing germs with trusted pine fragrance.'
    }
  });

  await prisma.productListing.createMany({
    data: [
      { productId: dettol.id, sellerName: 'Meesho', sellerUrl: 'https://meesho.com/search?q=dettol+soap', price: 165.00, currency: 'INR', rating: 4.6, reviewCount: 1200 },
      { productId: dettol.id, sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/search?q=dettol+soap', price: 189.00, currency: 'INR', rating: 4.5, reviewCount: 5100 },
      { productId: dettol.id, sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=dettol+soap', price: 210.00, currency: 'INR', rating: 4.7, reviewCount: 8900 }
    ]
  });

  // 3. Pears Pure & Gentle Bathing Bar
  const pears = await prisma.product.create({
    data: {
      name: 'Pears Pure & Gentle Bathing Bar with 98% Pure Glycerin (Pack of 3)',
      category: 'Personal Care',
      brand: 'Pears',
      imageUrl: 'https://images.unsplash.com/photo-1607006411601-775c8cc632dc?q=80&w=600',
      description: 'Pears transparent bathing bar with pure glycerin and natural oils, keeps skin soft and glowing.'
    }
  });

  await prisma.productListing.createMany({
    data: [
      { productId: pears.id, sellerName: 'Meesho', sellerUrl: 'https://meesho.com/search?q=pears+soap', price: 199.00, currency: 'INR', rating: 4.4, reviewCount: 650 },
      { productId: pears.id, sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/search?q=pears+soap', price: 235.00, currency: 'INR', rating: 4.5, reviewCount: 1800 },
      { productId: pears.id, sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=pears+soap', price: 249.00, currency: 'INR', rating: 4.6, reviewCount: 3400 }
    ]
  });

  // 4. Medimix 18 Herbs Ayurvedic Soap
  const medimix = await prisma.product.create({
    data: {
      name: 'Medimix Ayurvedic 18 Herbs Classic Bathing Soap (Pack of 5 x 125g)',
      category: 'Personal Care',
      brand: 'Medimix',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600',
      description: 'Fast acting Ayurvedic formulation with 18 herbs, prevents acne, body odor, and skin infections.'
    }
  });

  await prisma.productListing.createMany({
    data: [
      { productId: medimix.id, sellerName: 'Meesho', sellerUrl: 'https://meesho.com/search?q=medimix+soap', price: 130.00, currency: 'INR', rating: 4.3, reviewCount: 420 },
      { productId: medimix.id, sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/search?q=medimix+soap', price: 155.00, currency: 'INR', rating: 4.4, reviewCount: 1400 },
      { productId: medimix.id, sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=medimix+soap', price: 170.00, currency: 'INR', rating: 4.5, reviewCount: 2200 }
    ]
  });

  // 5. Santoor Sandal and Turmeric Soap
  const santoor = await prisma.product.create({
    data: {
      name: 'Santoor Sandal and Turmeric Bathing Soap (Pack of 4 x 100g)',
      category: 'Personal Care',
      brand: 'Santoor',
      imageUrl: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?q=80&w=600',
      description: 'Infused with natural Sandalwood and Turmeric extracts for soft, young, glowing skin.'
    }
  });

  await prisma.productListing.createMany({
    data: [
      { productId: santoor.id, sellerName: 'Meesho', sellerUrl: 'https://meesho.com/search?q=santoor+soap', price: 120.00, currency: 'INR', rating: 4.4, reviewCount: 380 },
      { productId: santoor.id, sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/search?q=santoor+soap', price: 140.00, currency: 'INR', rating: 4.3, reviewCount: 1600 },
      { productId: santoor.id, sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=santoor+soap', price: 155.00, currency: 'INR', rating: 4.5, reviewCount: 2900 }
    ]
  });

  console.log('✅ Added 5 Popular Soap brands with 15 Multi-Store Comparison listings (Meesho, Flipkart, Amazon)!');

  await prisma.$disconnect();
}

seedSoapsAndPersonalCare();
