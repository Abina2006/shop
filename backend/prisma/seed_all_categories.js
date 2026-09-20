import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMassiveProductCatalog() {
  console.log('=== Populating Universal Multi-Category Product Catalog in PostgreSQL ===\n');

  const productsData = [
    // --- 1. FASHION & CLOTHING ---
    {
      name: "Levi's Men's 511 Slim Fit Stretchable Jeans",
      category: "Fashion",
      brand: "Levi's",
      imageUrl: "https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=600",
      description: "Iconic Levi's 511 slim fit denim jeans with premium stretch comfort and classic 5-pocket styling.",
      listings: [
        { sellerName: 'Myntra', sellerUrl: 'https://myntra.com/levis-511-jeans', price: 1899.00, rating: 4.5, reviewCount: 3200 },
        { sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/search?q=levis+511', price: 2099.00, rating: 4.4, reviewCount: 1500 },
        { sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=levis+511+jeans', price: 2299.00, rating: 4.6, reviewCount: 4100 }
      ]
    },
    {
      name: "Puma Classic Unisex Fleece Pullover Hoodie",
      category: "Fashion",
      brand: "Puma",
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600",
      description: "Soft brushed fleece hoodie with kangaroo front pocket and ribbed hem cuffs for daily casual wear.",
      listings: [
        { sellerName: 'Meesho', sellerUrl: 'https://meesho.com/search?q=puma+hoodie', price: 999.00, rating: 4.2, reviewCount: 780 },
        { sellerName: 'Myntra', sellerUrl: 'https://myntra.com/puma-hoodie', price: 1399.00, rating: 4.6, reviewCount: 2400 },
        { sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=puma+hoodie', price: 1599.00, rating: 4.5, reviewCount: 3100 }
      ]
    },

    // --- 2. PERSONAL CARE & BEAUTY ---
    {
      name: "Tresemme Keratin Smooth Anti-Frizz Hair Shampoo (1 Litre)",
      category: "Personal Care",
      brand: "Tresemme",
      imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600",
      description: "Infused with Keratin and Argan oil for up to 72 hours of salon-like frizz control and smoothness.",
      listings: [
        { sellerName: 'Meesho', sellerUrl: 'https://meesho.com/search?q=tresemme+shampoo', price: 549.00, rating: 4.4, reviewCount: 650 },
        { sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/search?q=tresemme+shampoo', price: 620.00, rating: 4.5, reviewCount: 3900 },
        { sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=tresemme+shampoo', price: 680.00, rating: 4.6, reviewCount: 8200 }
      ]
    },
    {
      name: "Fogg Scent Xpressio Long-Lasting Eau De Parfum for Men (100ml)",
      category: "Personal Care",
      brand: "Fogg",
      imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600",
      description: "Rich woody aromatic fragrance crafted without water gas, lasting for more than 12 hours.",
      listings: [
        { sellerName: 'Meesho', sellerUrl: 'https://meesho.com/search?q=fogg+perfume', price: 349.00, rating: 4.3, reviewCount: 1100 },
        { sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/search?q=fogg+perfume', price: 399.00, rating: 4.4, reviewCount: 4200 },
        { sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=fogg+perfume', price: 440.00, rating: 4.5, reviewCount: 6300 }
      ]
    },

    // --- 3. GROCERIES & KITCHEN ESSENTIALS ---
    {
      name: "Fortune Sunlite Refined Sunflower Oil Pouch (1 Litre)",
      category: "Groceries",
      brand: "Fortune",
      imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600",
      description: "Light and healthy cooking oil enriched with Vitamin A and D for everyday nutritional frying and curries.",
      listings: [
        { sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/search?q=fortune+sunflower+oil', price: 128.00, rating: 4.6, reviewCount: 8500 },
        { sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=fortune+sunflower+oil', price: 135.00, rating: 4.7, reviewCount: 12000 },
        { sellerName: 'Blinkit', sellerUrl: 'https://blinkit.com/prn/fortune-oil/prid/1234', price: 142.00, rating: 4.8, reviewCount: 4300 }
      ]
    },
    {
      name: "Tata Tea Gold Royal Assam & Darjeeling Long Leaves (500g)",
      category: "Groceries",
      brand: "Tata",
      imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600",
      description: "Exquisite blend of rich Assam CTC tea paired with 15% gently rolled long Darjeeling tea leaves.",
      listings: [
        { sellerName: 'Meesho', sellerUrl: 'https://meesho.com/search?q=tata+tea+gold', price: 285.00, rating: 4.5, reviewCount: 920 },
        { sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/search?q=tata+tea+gold', price: 310.00, rating: 4.6, reviewCount: 6700 },
        { sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=tata+tea+gold', price: 329.00, rating: 4.7, reviewCount: 11400 }
      ]
    },

    // --- 4. SMARTPHONES & ELECTRONICS ---
    {
      name: "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB/256GB)",
      category: "Electronics",
      brand: "Samsung",
      imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600",
      description: "Galaxy AI powerhouse with 200MP ProVisual Engine, built-in S-Pen, and Snapdragon 8 Gen 3 for Galaxy.",
      listings: [
        { sellerName: 'Croma', sellerUrl: 'https://croma.com/searchB?q=samsung+s24+ultra', price: 119999.00, rating: 4.8, reviewCount: 450 },
        { sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/search?q=samsung+s24+ultra', price: 121999.00, rating: 4.6, reviewCount: 1800 },
        { sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=samsung+s24+ultra', price: 124999.00, rating: 4.7, reviewCount: 3200 }
      ]
    },

    // --- 5. AUDIO & HEADPHONES ---
    {
      name: "JBL Flip 6 Waterproof Portable Bluetooth Speaker (30W)",
      category: "Audio",
      brand: "JBL",
      imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600",
      description: "IP67 waterproof and dustproof speaker with dual passive radiators and 12 hours of playtime.",
      listings: [
        { sellerName: 'Meesho', sellerUrl: 'https://meesho.com/search?q=jbl+flip+6', price: 8499.00, rating: 4.4, reviewCount: 310 },
        { sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/search?q=jbl+flip+6', price: 9299.00, rating: 4.5, reviewCount: 2200 },
        { sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=jbl+flip+6', price: 9999.00, rating: 4.7, reviewCount: 5400 }
      ]
    },

    // --- 6. LAPTOPS & COMPUTERS ---
    {
      name: "HP Pavilion 15 (13th Gen Intel Core i5, 16GB RAM, 512GB SSD)",
      category: "Computers",
      brand: "HP",
      imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600",
      description: "FHD micro-edge IPS anti-glare display, Backlit Keyboard, B&O audio, and Windows 11 with MS Office.",
      listings: [
        { sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/search?q=hp+pavilion+i5', price: 54990.00, rating: 4.4, reviewCount: 890 },
        { sellerName: 'Croma', sellerUrl: 'https://croma.com/searchB?q=hp+pavilion+i5', price: 55990.00, rating: 4.6, reviewCount: 420 },
        { sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=hp+pavilion+i5', price: 57490.00, rating: 4.5, reviewCount: 1600 }
      ]
    },

    // --- 7. FOOTWEAR ---
    {
      name: "Adidas Ultraboost Light Running Shoes",
      category: "Footwear",
      brand: "Adidas",
      imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=600",
      description: "Epic energy return with 30% lighter Boost material, Linear Energy Push system, and Continental Rubber outsole.",
      listings: [
        { sellerName: 'Myntra', sellerUrl: 'https://myntra.com/adidas-ultraboost', price: 8999.00, rating: 4.7, reviewCount: 940 },
        { sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/search?q=adidas+ultraboost', price: 9499.00, rating: 4.5, reviewCount: 510 },
        { sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=adidas+ultraboost', price: 9999.00, rating: 4.6, reviewCount: 1400 }
      ]
    },

    // --- 8. HOME & KITCHEN APPLIANCES ---
    {
      name: "Philips Digital Air Fryer with Rapid Air Technology (4.1 Litre)",
      category: "Appliances",
      brand: "Philips",
      imageUrl: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?q=80&w=600",
      description: "Cook with up to 90% less oil, touch screen with 7 presets, keep warm function, and NutriU recipe app support.",
      listings: [
        { sellerName: 'Meesho', sellerUrl: 'https://meesho.com/search?q=philips+air+fryer', price: 5999.00, rating: 4.4, reviewCount: 420 },
        { sellerName: 'Flipkart', sellerUrl: 'https://flipkart.com/search?q=philips+air+fryer', price: 6499.00, rating: 4.5, reviewCount: 2800 },
        { sellerName: 'Amazon', sellerUrl: 'https://amazon.in/s?k=philips+air+fryer', price: 6999.00, rating: 4.7, reviewCount: 6500 }
      ]
    }
  ];

  for (const item of productsData) {
    let p = await prisma.product.findFirst({ where: { name: item.name } });
    if (!p) {
      p = await prisma.product.create({
        data: {
          name: item.name,
          category: item.category,
          brand: item.brand,
          imageUrl: item.imageUrl,
          description: item.description
        }
      });
    }

    for (const l of item.listings) {
      await prisma.productListing.upsert({
        where: {
          id: `${p.id}-${l.sellerName}`.substring(0, 36) // Unique fallback key
        },
        create: {
          productId: p.id,
          sellerName: l.sellerName,
          sellerUrl: l.sellerUrl,
          price: l.price,
          currency: 'INR',
          rating: l.rating,
          reviewCount: l.reviewCount
        },
        update: {
          price: l.price,
          rating: l.rating,
          reviewCount: l.reviewCount,
          sellerUrl: l.sellerUrl
        }
      }).catch(async () => {
        await prisma.productListing.create({
          data: {
            productId: p.id,
            sellerName: l.sellerName,
            sellerUrl: l.sellerUrl,
            price: l.price,
            currency: 'INR',
            rating: l.rating,
            reviewCount: l.reviewCount
          }
        });
      });
    }
  }

  const count = await prisma.product.count();
  const listingCount = await prisma.productListing.count();
  console.log(`\n🎉 CATALOG EXPANDED: ${count} Total Products & ${listingCount} Store Comparison Listings across ALL categories!`);

  await prisma.$disconnect();
}

seedMassiveProductCatalog();
