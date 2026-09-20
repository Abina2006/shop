import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed20CategoriesFast() {
  console.log('🚀 Starting Super-Fast 20-Category Database Seeding for ShopWise AI...\n');

  // 1. Clean existing table contents to start fresh with perfect dataset
  await prisma.review.deleteMany({});
  await prisma.priceHistory.deleteMany({});
  await prisma.priceAlert.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.platformRecommendation.deleteMany({});
  await prisma.productListing.deleteMany({});
  await prisma.product.deleteMany({});

  console.log('🧹 Cleaned existing tables.');

  const PRODUCTS_DATA = [
    // 1. Mobiles & Tablets
    {
      name: "Apple iPhone 15 Pro Max (Natural Titanium, 256GB)",
      category: "Mobiles & Tablets",
      brand: "Apple",
      imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600",
      description: "Forged in titanium with A17 Pro chip, customizable Action button, USB-C, and 5x Optical Zoom.",
      listings: [
        { sellerName: "Reliance Digital", sellerUrl: "https://www.reliancedigital.in/search?q=iphone+15+pro+max", price: 143900.00, rating: 4.8, reviewCount: 910, deliveryTime: "1-2 Days", offers: "Direct Reliance Card Discount 5%" },
        { sellerName: "Croma", sellerUrl: "https://www.croma.com/searchB?q=iphone+15+pro+max", price: 144900.00, rating: 4.9, reviewCount: 1120, deliveryTime: "1-2 Days", offers: "₹5000 Instant Cashback on ICICI" },
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=iphone+15+pro+max", price: 147900.00, rating: 4.8, reviewCount: 6150, deliveryTime: "Tomorrow", offers: "No Cost EMI up to 12 Months" },
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=iphone+15+pro+max", price: 149900.00, rating: 4.7, reviewCount: 3820, deliveryTime: "2-3 Days", offers: "Free Apple Music for 6 Months" }
      ]
    },
    {
      name: "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB/256GB)",
      category: "Mobiles & Tablets",
      brand: "Samsung",
      imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600",
      description: "Galaxy AI powered flagship phone with 200MP Quad Telephoto camera, Snapdragon 8 Gen 3 for Galaxy, and built-in S-Pen.",
      listings: [
        { sellerName: "Reliance Digital", sellerUrl: "https://www.reliancedigital.in/search?q=samsung+s24+ultra", price: 118999.00, rating: 4.7, reviewCount: 880, deliveryTime: "1-2 Days", offers: "Special HDFC Cashback ₹5000" },
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=samsung+s24+ultra", price: 119999.00, rating: 4.7, reviewCount: 2450, deliveryTime: "1-2 Days", offers: "Bank Offer ₹10000 Instant Discount" },
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=samsung+s24+ultra", price: 121999.00, rating: 4.8, reviewCount: 4890, deliveryTime: "Tomorrow", offers: "Up to ₹5000 Exchange Bonus" },
        { sellerName: "Croma", sellerUrl: "https://www.croma.com/searchB?q=samsung+s24+ultra", price: 124999.00, rating: 4.6, reviewCount: 910, deliveryTime: "2-3 Days", offers: "Complimentary 1-Year Screen Protection" }
      ]
    },
    {
      name: "Apple iPad Air M2 (11-inch, Wi-Fi, 128GB, Space Grey)",
      category: "Mobiles & Tablets",
      brand: "Apple",
      imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600",
      description: "Powerful Apple M2 processor with Liquid Retina display, Wi-Fi 6E support, and Apple Pencil Pro compatibility.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=ipad+air+m2", price: 56900.00, rating: 4.8, reviewCount: 1450, deliveryTime: "Tomorrow", offers: "Bank Cashback ₹3000" },
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=ipad+air+m2", price: 57900.00, rating: 4.7, reviewCount: 980, deliveryTime: "2 Days", offers: "Exchange Offer Available" },
        { sellerName: "Croma", sellerUrl: "https://www.croma.com/searchB?q=ipad+air+m2", price: 59900.00, rating: 4.6, reviewCount: 320, deliveryTime: "1-2 Days", offers: "Student Discount Applicable" }
      ]
    },

    // 2. Laptops & Computers
    {
      name: "Apple MacBook Air M3 2024 (13.6-inch, 8GB RAM, 256GB SSD)",
      category: "Laptops & Computers",
      brand: "Apple",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600",
      description: "Supercharged by M3 chip with 8-core CPU and 10-core GPU, Liquid Retina Display, 1080p FaceTime HD Camera, 18-hour battery.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=macbook+air+m3", price: 109900.00, rating: 4.8, reviewCount: 3200, deliveryTime: "Tomorrow", offers: "Flat ₹5000 Cashback on HDFC" },
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=macbook+air+m3", price: 112900.00, rating: 4.7, reviewCount: 1890, deliveryTime: "2 Days", offers: "Free Microsoft 365 Subscription" },
        { sellerName: "Croma", sellerUrl: "https://www.croma.com/searchB?q=macbook+air+m3", price: 114900.00, rating: 4.8, reviewCount: 740, deliveryTime: "1-2 Days", offers: "Student Savings Discount" }
      ]
    },
    {
      name: "HP Pavilion 15 (13th Gen Intel Core i5, 16GB RAM, 512GB SSD)",
      category: "Laptops & Computers",
      brand: "HP",
      imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600",
      description: "FHD micro-edge IPS anti-glare display, Backlit Keyboard, B&O audio, and Windows 11 with MS Office.",
      listings: [
        { sellerName: "Tata CLiQ", sellerUrl: "https://www.tatacliq.com/search/?searchCategory=all&text=hp+pavilion+i5", price: 52490.00, rating: 4.5, reviewCount: 410, deliveryTime: "2 Days", offers: "Exclusive Brand Offer ₹1500 Off" },
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=hp+pavilion+i5", price: 53990.00, rating: 4.5, reviewCount: 1890, deliveryTime: "2 Days", offers: "Exchange up to ₹10000" },
        { sellerName: "Croma", sellerUrl: "https://www.croma.com/searchB?q=hp+pavilion+i5", price: 55990.00, rating: 4.6, reviewCount: 420, deliveryTime: "1-2 Days", offers: "Free Laptop Backpack & Wireless Mouse" },
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=hp+pavilion+i5", price: 57490.00, rating: 4.4, reviewCount: 3120, deliveryTime: "Tomorrow", offers: "No Cost EMI Available" }
      ]
    },

    // 3. Electronics & Accessories
    {
      name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
      category: "Electronics & Accessories",
      brand: "Sony",
      imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600",
      description: "Industry-leading Active Noise Cancellation with two processors and 8 microphones, crisp Hi-Res audio, and 30-hour battery life.",
      listings: [
        { sellerName: "Reliance Digital", sellerUrl: "https://www.reliancedigital.in/search?q=sony+wh+1000xm5", price: 26490.00, rating: 4.7, reviewCount: 890, deliveryTime: "1-2 Days", offers: "Direct Reliance Card Instant Discount" },
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=sony+wh+1000xm5", price: 26990.00, rating: 4.7, reviewCount: 8420, deliveryTime: "Tomorrow", offers: "Instant ₹3000 Discount on HDFC" },
        { sellerName: "Croma", sellerUrl: "https://www.croma.com/searchB?q=sony+wh+1000xm5", price: 28990.00, rating: 4.8, reviewCount: 1420, deliveryTime: "1-2 Days", offers: "Free Carrying Case" }
      ]
    },
    {
      name: "boAt Airdopes 131 True Wireless Earbuds",
      category: "Electronics & Accessories",
      brand: "boAt",
      imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600",
      description: "Wireless TWS Earbuds with 13mm Drivers, IWP Technology, Type-C Charging, and up to 60 Hours Total Playback.",
      listings: [
        { sellerName: "Meesho", sellerUrl: "https://meesho.com/search?q=boat+airdopes+131", price: 799.00, rating: 4.3, reviewCount: 4890, deliveryTime: "3-4 Days", offers: "Factory Direct Discount 15%" },
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=boat+airdopes+131", price: 899.00, rating: 4.2, reviewCount: 89500, deliveryTime: "Tomorrow", offers: "Save ₹100 Coupon" },
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=boat+airdopes+131", price: 999.00, rating: 4.1, reviewCount: 65200, deliveryTime: "2 Days", offers: "5% Unlimited Cashback" }
      ]
    },

    // 4. Fashion & Clothing
    {
      name: "Levi's Men's 511 Slim Fit Stretchable Jeans",
      category: "Fashion & Clothing",
      brand: "Levi's",
      imageUrl: "https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=600",
      description: "Iconic Levi's 511 slim fit denim jeans with premium stretch comfort and classic 5-pocket styling.",
      listings: [
        { sellerName: "Myntra", sellerUrl: "https://myntra.com/levis-511-jeans", price: 1899.00, rating: 4.5, reviewCount: 3200, deliveryTime: "2 Days", offers: "10% Extra Brand Coupon" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=levis+511", price: 2099.00, rating: 4.4, reviewCount: 1500, deliveryTime: "3 Days", offers: "Bank Discount ₹150" },
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=levis+511+jeans", price: 2299.00, rating: 4.6, reviewCount: 4100, deliveryTime: "Tomorrow", offers: "Free Returns 10 Days" }
      ]
    },
    {
      name: "Puma Classic Unisex Fleece Pullover Hoodie",
      category: "Fashion & Clothing",
      brand: "Puma",
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600",
      description: "Soft brushed fleece hoodie with kangaroo front pocket and ribbed hem cuffs for daily casual wear.",
      listings: [
        { sellerName: "Meesho", sellerUrl: "https://meesho.com/search?q=puma+hoodie", price: 999.00, rating: 4.2, reviewCount: 780, deliveryTime: "4 Days", offers: "Direct Wholesale Rate" },
        { sellerName: "Myntra", sellerUrl: "https://myntra.com/puma-hoodie", price: 1399.00, rating: 4.6, reviewCount: 2400, deliveryTime: "2 Days", offers: "Extra 15% Off Code" },
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=puma+hoodie", price: 1599.00, rating: 4.5, reviewCount: 3100, deliveryTime: "Tomorrow", offers: "Prime Free Delivery" }
      ]
    },

    // 5. Shoes & Footwear
    {
      name: "Adidas Ultraboost Light Running Shoes",
      category: "Shoes & Footwear",
      brand: "Adidas",
      imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=600",
      description: "Epic energy return with 30% lighter Boost material, Linear Energy Push system, and Continental Rubber outsole.",
      listings: [
        { sellerName: "Myntra", sellerUrl: "https://myntra.com/adidas-ultraboost", price: 8999.00, rating: 4.7, reviewCount: 940, deliveryTime: "2 Days", offers: "Myntra Insider Discount" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=adidas+ultraboost", price: 9499.00, rating: 4.5, reviewCount: 510, deliveryTime: "3 Days", offers: "SuperCoin Savings" },
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=adidas+ultraboost", price: 9999.00, rating: 4.6, reviewCount: 1400, deliveryTime: "Tomorrow", offers: "No Cost EMI Available" }
      ]
    },
    {
      name: "Sw Mexico T Blue Dailywear Sports Sneakers",
      category: "Shoes & Footwear",
      brand: "Sw",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
      description: "Lightweight breathable mesh daily wear sneakers for men with high-density EVA cushioning sole.",
      listings: [
        { sellerName: "Meesho", sellerUrl: "https://meesho.com/search?q=sw+mexico+shoes", price: 431.00, rating: 4.3, reviewCount: 1850, deliveryTime: "3-4 Days", offers: "Factory Direct Rate 25% Off" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=sw+mexico+shoes", price: 449.00, rating: 4.4, reviewCount: 2340, deliveryTime: "2 Days", offers: "Fashion Flash Deal" },
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=sw+mexico+shoes", price: 458.00, rating: 4.5, reviewCount: 1980, deliveryTime: "Tomorrow", offers: "Free Delivery" }
      ]
    },

    // 6. Beauty & Personal Care
    {
      name: "Tresemme Keratin Smooth Anti-Frizz Hair Shampoo (1 Litre)",
      category: "Beauty & Personal Care",
      brand: "Tresemme",
      imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600",
      description: "Infused with Keratin and Argan oil for up to 72 hours of salon-like frizz control and smoothness.",
      listings: [
        { sellerName: "Meesho", sellerUrl: "https://meesho.com/search?q=tresemme+shampoo", price: 549.00, rating: 4.4, reviewCount: 650, deliveryTime: "3 Days", offers: "Direct Manufacturer Rate" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=tresemme+shampoo", price: 620.00, rating: 4.5, reviewCount: 3900, deliveryTime: "2 Days", offers: "Buy 2 Get 10% Extra" },
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=tresemme+shampoo", price: 680.00, rating: 4.6, reviewCount: 8200, deliveryTime: "Tomorrow", offers: "Subscribe & Save 5%" }
      ]
    },
    {
      name: "Fogg Scent Xpressio Long-Lasting Eau De Parfum for Men (100ml)",
      category: "Beauty & Personal Care",
      brand: "Fogg",
      imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600",
      description: "Rich woody aromatic fragrance crafted without water gas, lasting for more than 12 hours.",
      listings: [
        { sellerName: "Meesho", sellerUrl: "https://meesho.com/search?q=fogg+perfume", price: 349.00, rating: 4.3, reviewCount: 1100, deliveryTime: "3 Days", offers: "Direct Dealer Savings" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=fogg+perfume", price: 399.00, rating: 4.4, reviewCount: 4200, deliveryTime: "2 Days", offers: "Combo Deal Savings" },
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=fogg+perfume", price: 440.00, rating: 4.5, reviewCount: 6300, deliveryTime: "Tomorrow", offers: "Prime Delivery" }
      ]
    },

    // 7. Home & Kitchen
    {
      name: "Philips Digital Air Fryer with Rapid Air Technology (4.1 Litre)",
      category: "Home & Kitchen",
      brand: "Philips",
      imageUrl: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?q=80&w=600",
      description: "Cook with up to 90% less oil, touch screen with 7 presets, keep warm function, and NutriU recipe app support.",
      listings: [
        { sellerName: "Meesho", sellerUrl: "https://meesho.com/search?q=philips+air+fryer", price: 5999.00, rating: 4.4, reviewCount: 420, deliveryTime: "3 Days", offers: "Special Wholesale Price" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=philips+air+fryer", price: 6499.00, rating: 4.5, reviewCount: 2800, deliveryTime: "2 Days", offers: "Bank Offer ₹500 Off" },
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=philips+air+fryer", price: 6999.00, rating: 4.7, reviewCount: 6500, deliveryTime: "Tomorrow", offers: "No Cost EMI Available" }
      ]
    },
    {
      name: "Prestige Iris 750W Mixer Grinder with 4 Stainless Steel Jars",
      category: "Home & Kitchen",
      brand: "Prestige",
      imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=600",
      description: "750W heavy-duty motor, 3 stainless steel grinding jars + 1 polycarbonate juicer jar with overload protection.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=prestige+iris+mixer", price: 2899.00, rating: 4.4, reviewCount: 14200, deliveryTime: "Tomorrow", offers: "Save ₹300 Coupon" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=prestige+iris+mixer", price: 3199.00, rating: 4.3, reviewCount: 9800, deliveryTime: "2 Days", offers: "SuperCoin Discount" }
      ]
    },

    // 8. Furniture
    {
      name: "Green Soul Monster Ultimate Ergonomic Gaming Chair",
      category: "Furniture",
      brand: "Green Soul",
      imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=600",
      description: "Heavy-duty metal base, premium breathable fabric, 4D adjustable armrests, and 180-degree recline for lumbar support.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=green+soul+chair", price: 14990.00, rating: 4.6, reviewCount: 5200, deliveryTime: "2 Days", offers: "Flat ₹1500 Bank Rebate" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=green+soul+chair", price: 15990.00, rating: 4.5, reviewCount: 2300, deliveryTime: "3 Days", offers: "No Cost EMI 6 Months" }
      ]
    },
    {
      name: "Solimo Vega 3 Seater Fabric Sofa (Charcoal Grey)",
      category: "Furniture",
      brand: "Solimo",
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600",
      description: "High-density foam seating with sturdy solid wood frame and stain-resistant premium upholstery.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=solimo+3+seater+sofa", price: 16499.00, rating: 4.4, reviewCount: 1850, deliveryTime: "4 Days", offers: "Free Furniture Assembly" },
        { sellerName: "Pepperfry", sellerUrl: "https://pepperfry.com/search?q=3+seater+sofa", price: 17999.00, rating: 4.5, reviewCount: 420, deliveryTime: "5 Days", offers: "Extra 10% Cashback" }
      ]
    },

    // 9. Toys & Baby Products
    {
      name: "LEGO Classic Large Creative Brick Box (790 Pieces)",
      category: "Toys & Baby Products",
      brand: "LEGO",
      imageUrl: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=600",
      description: "Includes 33 different colors of bricks, 8 types of windows and doors, 2 green baseplates, and wheels.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=lego+classic+box", price: 3499.00, rating: 4.8, reviewCount: 8900, deliveryTime: "Tomorrow", offers: "Authentic LEGO Certified" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=lego+classic+box", price: 3799.00, rating: 4.7, reviewCount: 3400, deliveryTime: "2 Days", offers: "Toy Fest Savings" }
      ]
    },
    {
      name: "Hot Wheels 10-Car Pack Die-Cast Toy Vehicles",
      category: "Toys & Baby Products",
      brand: "Hot Wheels",
      imageUrl: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=600",
      description: "Set of 10 authentic die-cast 1:64 scale vehicles with realistic details and eye-catching decos.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=hot+wheels+10+pack", price: 999.00, rating: 4.7, reviewCount: 4500, deliveryTime: "Tomorrow", offers: "Save ₹100 Coupon" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=hot+wheels+10+pack", price: 1099.00, rating: 4.6, reviewCount: 2800, deliveryTime: "2 Days", offers: "5% Card Discount" }
      ]
    },

    // 10. Books & Stationery
    {
      name: "Atomic Habits by James Clear (Hardcover Collector Edition)",
      category: "Books & Stationery",
      brand: "Penguin",
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600",
      description: "An easy and proven way to build good habits and break bad ones. International bestseller with over 15M copies sold.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=atomic+habits", price: 499.00, rating: 4.9, reviewCount: 94000, deliveryTime: "Tomorrow", offers: "Bestseller Price Guarantee" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=atomic+habits", price: 549.00, rating: 4.8, reviewCount: 42000, deliveryTime: "2 Days", offers: "Free Bookmark Included" }
      ]
    },
    {
      name: "Casio FX-991CW ClassWiz Non-Programmable Scientific Calculator",
      category: "Books & Stationery",
      brand: "Casio",
      imageUrl: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?q=80&w=600",
      description: "High-resolution natural textbook display with 540+ functions, QR code visualization, and dual power solar/battery.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=casio+fx+991cw", price: 1295.00, rating: 4.7, reviewCount: 8900, deliveryTime: "Tomorrow", offers: "Official 3-Year Casio Warranty" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=casio+fx+991cw", price: 1395.00, rating: 4.6, reviewCount: 4100, deliveryTime: "2 Days", offers: "SuperCoin Savings" }
      ]
    },

    // 11. Sports & Fitness
    {
      name: "Decathlon Domyos Rubber Hex Dumbbell Set (10kg Pair)",
      category: "Sports & Fitness",
      brand: "Decathlon",
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600",
      description: "Ergonomic chrome handle with non-slip knurling and durable rubber hex coating to protect home floors.",
      listings: [
        { sellerName: "Decathlon", sellerUrl: "https://decathlon.in/search?q=10kg+dumbbell", price: 2499.00, rating: 4.8, reviewCount: 3100, deliveryTime: "2 Days", offers: "Direct Store Warranty" },
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=hex+dumbbell+10kg", price: 2799.00, rating: 4.6, reviewCount: 1400, deliveryTime: "Tomorrow", offers: "Prime Shipping" }
      ]
    },
    {
      name: "Yonex Muscle Power 29 Light Badminton Racket",
      category: "Sports & Fitness",
      brand: "Yonex",
      imageUrl: "https://images.unsplash.com/photo-1626225967045-9c76db7b3ed4?q=80&w=600",
      description: "Full graphite frame with isometric head shape for expanded sweet spot and high tension stringing.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=yonex+muscle+power+29", price: 1899.00, rating: 4.6, reviewCount: 6700, deliveryTime: "Tomorrow", offers: "Free Racket Cover Included" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=yonex+muscle+power+29", price: 2099.00, rating: 4.5, reviewCount: 3900, deliveryTime: "2 Days", offers: "Bank Offer 5% Off" }
      ]
    },

    // 12. Grocery & Daily Essentials
    {
      name: "Fortune Sunlite Refined Sunflower Oil Pouch (1 Litre)",
      category: "Grocery & Daily Essentials",
      brand: "Fortune",
      imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600",
      description: "Light and healthy cooking oil enriched with Vitamin A and D for everyday frying and cooking.",
      listings: [
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=fortune+oil", price: 128.00, rating: 4.6, reviewCount: 8500, deliveryTime: "2 Days", offers: "Grocery Deal Price" },
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=fortune+oil", price: 135.00, rating: 4.7, reviewCount: 12000, deliveryTime: "Tomorrow", offers: "Pantry Savings" },
        { sellerName: "Blinkit", sellerUrl: "https://blinkit.com/prn/fortune-oil/prid/123", price: 142.00, rating: 4.8, reviewCount: 4300, deliveryTime: "10 Mins", offers: "Instant Express Delivery" }
      ]
    },
    {
      name: "Tata Tea Gold Royal Assam & Darjeeling Long Leaves (500g)",
      category: "Grocery & Daily Essentials",
      brand: "Tata",
      imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600",
      description: "Exquisite blend of rich Assam CTC tea paired with 15% gently rolled long Darjeeling tea leaves.",
      listings: [
        { sellerName: "Meesho", sellerUrl: "https://meesho.com/search?q=tata+tea+gold", price: 285.00, rating: 4.5, reviewCount: 920, deliveryTime: "3 Days", offers: "Wholesale Rate" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=tata+tea+gold", price: 310.00, rating: 4.6, reviewCount: 6700, deliveryTime: "2 Days", offers: "SuperCoin Discount" },
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=tata+tea+gold", price: 329.00, rating: 4.7, reviewCount: 11400, deliveryTime: "Tomorrow", offers: "Pantry Offer" }
      ]
    },

    // 13. Jewellery & Accessories
    {
      name: "GIVA 925 Sterling Silver Zircon Solitaire Necklace",
      category: "Jewellery & Accessories",
      brand: "GIVA",
      imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600",
      description: "Pure 925 sterling silver with AAA+ quality cubic zirconia solitaire pendant and rhodium anti-tarnish finish.",
      listings: [
        { sellerName: "GIVA", sellerUrl: "https://giva.co/search?q=solitaire+necklace", price: 1499.00, rating: 4.8, reviewCount: 4200, deliveryTime: "2 Days", offers: "Free Silver Cleaning Cloth" },
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=giva+necklace", price: 1699.00, rating: 4.7, reviewCount: 2900, deliveryTime: "Tomorrow", offers: "GIVA Authenticity Certificate" }
      ]
    },
    {
      name: "Fossil Minimalist Men's Quartz Chronograph Stainless Steel Watch",
      category: "Jewellery & Accessories",
      brand: "Fossil",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600",
      description: "Classic slim stainless steel case with blue sunray dial, stopwatch chronograph timers, and 50m water resistance.",
      listings: [
        { sellerName: "Myntra", sellerUrl: "https://myntra.com/fossil-watch", price: 7995.00, rating: 4.7, reviewCount: 1890, deliveryTime: "2 Days", offers: "Extra 10% Brand Coupon" },
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=fossil+minimalist+watch", price: 8495.00, rating: 4.6, reviewCount: 3400, deliveryTime: "Tomorrow", offers: "Official 2-Year Fossil Warranty" }
      ]
    },

    // 14. Automotive
    {
      name: "Mi Portable Electric Air Compressor 1S for Car & Bike Tyres",
      category: "Automotive",
      brand: "Xiaomi",
      imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600",
      description: "Digital tyre pressure sensing with auto-stop function, built-in LED light, and Type-C rechargeable battery.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=mi+air+compressor+1s", price: 2799.00, rating: 4.6, reviewCount: 14200, deliveryTime: "Tomorrow", offers: "Save ₹200 Coupon" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=mi+air+compressor", price: 2999.00, rating: 4.5, reviewCount: 7800, deliveryTime: "2 Days", offers: "Bank Discount 5%" }
      ]
    },
    {
      name: "70mai Smart Dash Cam Pro Plus+ A500S Dual-Channel",
      category: "Automotive",
      brand: "70mai",
      imageUrl: "https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=600",
      description: "2.7K Ultra HD front & 1080p rear recording with built-in GPS, ADAS safety alerts, and 24H parking surveillance.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=70mai+a500s", price: 8999.00, rating: 4.7, reviewCount: 3800, deliveryTime: "Tomorrow", offers: "Free SD Card Adapter" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=70mai+a500s", price: 9499.00, rating: 4.6, reviewCount: 1900, deliveryTime: "2 Days", offers: "No Cost EMI" }
      ]
    },

    // 15. Pet Supplies
    {
      name: "Royal Canin Mini Adult Dry Dog Food (4kg)",
      category: "Pet Supplies",
      brand: "Royal Canin",
      imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600",
      description: "Tailored nutrition for small breed adult dogs (up to 10kg) with L-carnitine for optimal weight management and coat shine.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=royal+canin+mini+adult", price: 2299.00, rating: 4.7, reviewCount: 6500, deliveryTime: "Tomorrow", offers: "Prime Free Shipping" },
        { sellerName: "Supertails", sellerUrl: "https://supertails.com/search?q=royal+canin+mini", price: 2499.00, rating: 4.8, reviewCount: 1200, deliveryTime: "2 Days", offers: "Vet Support Advice Free" }
      ]
    },

    // 16. Tools & Home Improvement
    {
      name: "Bosch GSB 500W Professional Impact Drill Kit (100 Accessories)",
      category: "Tools & Home Improvement",
      brand: "Bosch",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600",
      description: "Robust 500W motor with forward/reverse rotation, keyless chuck, auxiliary handle, and 100-piece drilling tool set.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=bosch+gsb+500w", price: 3499.00, rating: 4.5, reviewCount: 11200, deliveryTime: "Tomorrow", offers: "Bosch Heavy Duty Warranty" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=bosch+gsb+500w", price: 3799.00, rating: 4.4, reviewCount: 5400, deliveryTime: "2 Days", offers: "SuperCoin Savings" }
      ]
    },

    // 17. Gaming
    {
      name: "Sony PlayStation 5 Console (Disc Edition, Slim)",
      category: "Gaming",
      brand: "Sony",
      imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600",
      description: "Ultra-high speed 1TB SSD, 4K 120Hz gaming with Tempest 3D AudioTech and DualSense haptic feedback.",
      listings: [
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=ps5+slim", price: 49990.00, rating: 4.8, reviewCount: 4200, deliveryTime: "2 Days", offers: "Bank Offer ₹4000 Off" },
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=ps5+slim", price: 51990.00, rating: 4.9, reviewCount: 8900, deliveryTime: "Tomorrow", offers: "Free Astro's Playroom Pre-installed" },
        { sellerName: "Croma", sellerUrl: "https://croma.com/searchB?q=ps5+slim", price: 54990.00, rating: 4.8, reviewCount: 1100, deliveryTime: "1-2 Days", offers: "Console Extended Warranty" }
      ]
    },
    {
      name: "Nintendo Switch OLED Model (Mario Red Edition)",
      category: "Gaming",
      brand: "Nintendo",
      imageUrl: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=600",
      description: "7-inch vibrant OLED display, wide adjustable stand, wired LAN dock, and 64GB internal storage in iconic Mario Red.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=nintendo+switch+oled", price: 29990.00, rating: 4.7, reviewCount: 3100, deliveryTime: "Tomorrow", offers: "Imported Authentic Edition" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=nintendo+switch+oled", price: 31490.00, rating: 4.6, reviewCount: 1500, deliveryTime: "2 Days", offers: "No Cost EMI" }
      ]
    },

    // 18. TV & Appliances
    {
      name: "Sony BRAVIA 55-inch 4K Ultra HD Smart LED Google TV (KD-55X74L)",
      category: "TV & Appliances",
      brand: "Sony",
      imageUrl: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=600",
      description: "4K Processor X1 with Live Color technology, Dolby Audio 20W open baffle speakers, Google TV OS, and Apple AirPlay.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=sony+bravia+55+x74l", price: 56990.00, rating: 4.8, reviewCount: 6400, deliveryTime: "Tomorrow", offers: "Free Wall Mount Installation" },
        { sellerName: "Croma", sellerUrl: "https://croma.com/searchB?q=sony+bravia+55", price: 59990.00, rating: 4.7, reviewCount: 1800, deliveryTime: "1-2 Days", offers: "2-Year Comprehensive Sony Warranty" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=sony+bravia+55", price: 62990.00, rating: 4.7, reviewCount: 3900, deliveryTime: "2 Days", offers: "Exchange Offer up to ₹5000" }
      ]
    },

    // 19. Travel & Luggage
    {
      name: "American Tourister AMT Splash 79cm Hard Cabin Trolley Bag",
      category: "Travel & Luggage",
      brand: "American Tourister",
      imageUrl: "https://images.unsplash.com/photo-1565026057447-b88e40e68e8b?q=80&w=600",
      description: "Scratch-resistant polypropylene shell, smooth 360-degree spinner wheels, flush TSA combination lock, and 3-year warranty.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=american+tourister+trolley", price: 3299.00, rating: 4.6, reviewCount: 12400, deliveryTime: "Tomorrow", offers: "Save ₹300 Coupon" },
        { sellerName: "Flipkart", sellerUrl: "https://flipkart.com/search?q=american+tourister+trolley", price: 3699.00, rating: 4.5, reviewCount: 8900, deliveryTime: "2 Days", offers: "Bank Discount 10%" }
      ]
    },

    // 20. Gifts & Others
    {
      name: "Echo Dot 5th Gen Smart Speaker with Alexa (Deep Blue)",
      category: "Gifts & Others",
      brand: "Amazon",
      imageUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=600",
      description: "Deepest bass and clearer vocals smart speaker with motion detection, temperature sensor, and hands-free Alexa voice control.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://amazon.in/s?k=echo+dot+5th+gen", price: 4499.00, rating: 4.6, reviewCount: 24500, deliveryTime: "Tomorrow", offers: "Prime Deal Savings" },
        { sellerName: "Croma", sellerUrl: "https://croma.com/searchB?q=echo+dot+5th+gen", price: 4999.00, rating: 4.5, reviewCount: 1400, deliveryTime: "1-2 Days", offers: "Store Pickup Available" }
      ]
    }
  ];

  let totalProductsCreated = 0;
  let totalListingsCreated = 0;

  for (const item of PRODUCTS_DATA) {
    const product = await prisma.product.create({
      data: {
        name: item.name,
        category: item.category,
        brand: item.brand,
        imageUrl: item.imageUrl,
        description: item.description,
        listings: {
          create: item.listings.map(l => ({
            sellerName: l.sellerName,
            sellerUrl: l.sellerUrl,
            price: l.price,
            currency: 'INR',
            rating: l.rating,
            reviewCount: l.reviewCount,
            deliveryTime: l.deliveryTime,
            offers: l.offers,
            lastScrapedAt: new Date(),
            priceHistory: {
              create: [
                { price: l.price, recordedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                { price: l.price, recordedAt: new Date() }
              ]
            },
            reviews: {
              create: [
                {
                  reviewerName: "Verified Customer",
                  rating: l.rating,
                  reviewText: `Great product quality! Highly recommend buying ${item.name} from ${l.sellerName}.`
                }
              ]
            }
          }))
        }
      }
    });

    totalProductsCreated++;
    totalListingsCreated += item.listings.length;
  }

  console.log(`\n🎉 SUCCESS! Populated ${totalProductsCreated} products & ${totalListingsCreated} store listings across ALL 20 Categories!`);
  await prisma.$disconnect();
}

seed20CategoriesFast().catch(async (err) => {
  console.error("❌ Seeding failed:", err);
  await prisma.$disconnect();
  process.exit(1);
});
