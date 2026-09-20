import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMasterCatalog() {
  console.log('🚀 Seeding Comprehensive Real-World Product Catalog (Amazon, Flipkart, Meesho, Croma, Myntra)...\n');

  const products = [
    // --- 1. SMARTPHONES & ELECTRONICS ---
    {
      name: "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB/256GB)",
      category: "Electronics",
      brand: "Samsung",
      imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800",
      description: "Galaxy AI powered flagship phone with 200MP Quad Telephoto camera, Snapdragon 8 Gen 3 for Galaxy, and built-in S-Pen.",
      listings: [
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=samsung+s24+ultra", price: 119999.00, rating: 4.7, reviewCount: 2450, deliveryTime: "1-2 Days", offers: "Bank Offer ₹10000 Instant Discount on HDFC Credit Cards" },
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=samsung+s24+ultra", price: 121999.00, rating: 4.8, reviewCount: 4890, deliveryTime: "Tomorrow", offers: "Up to ₹5000 Exchange Bonus" },
        { sellerName: "Croma", sellerUrl: "https://www.croma.com/searchB?q=samsung+s24+ultra", price: 124999.00, rating: 4.6, reviewCount: 910, deliveryTime: "2-3 Days", offers: "Complimentary 1-Year Screen Protection Plan" }
      ],
      reviews: [
        { reviewerName: "Rahul Sharma", rating: 5.0, reviewText: "Unbelievable camera zoom and Galaxy AI features like Circle to Search! Battery easily lasts 1.5 days." },
        { reviewerName: "Ananya Iyer", rating: 4.5, reviewText: "Screen is flat now and feels great in hand. S-Pen functionality is super handy for taking quick notes." }
      ]
    },
    {
      name: "Apple iPhone 15 Pro Max (Natural Titanium, 256GB)",
      category: "Electronics",
      brand: "Apple",
      imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800",
      description: "Forged in titanium with A17 Pro chip, customizable Action button, USB-C connector, and 5x Optical Telephoto Zoom.",
      listings: [
        { sellerName: "Croma", sellerUrl: "https://www.croma.com/searchB?q=iphone+15+pro+max", price: 144900.00, rating: 4.9, reviewCount: 1120, deliveryTime: "1-2 Days", offers: "₹5000 Instant Cashback on ICICI Cards" },
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=iphone+15+pro+max", price: 147900.00, rating: 4.8, reviewCount: 6150, deliveryTime: "Tomorrow", offers: "No Cost EMI up to 12 Months" },
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=iphone+15+pro+max", price: 149900.00, rating: 4.7, reviewCount: 3820, deliveryTime: "2-3 Days", offers: "Free Apple Music for 6 Months" }
      ],
      reviews: [
        { reviewerName: "Vikram Sethi", rating: 5.0, reviewText: "The natural titanium finish looks premium. A17 Pro runs AAA games smoothly without stutter." },
        { reviewerName: "Pooja Hegde", rating: 4.5, reviewText: "USB-C transfer speeds are blazing fast for video exports." }
      ]
    },
    {
      name: "OnePlus 12 5G (Flowy Emerald, 16GB RAM + 512GB Storage)",
      category: "Electronics",
      brand: "OnePlus",
      imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800",
      description: "Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System for Mobile, 2K 120Hz ProXDR Display, and 100W SUPERVOOC charging.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=oneplus+12", price: 64999.00, rating: 4.6, reviewCount: 3420, deliveryTime: "Tomorrow", offers: "Flat ₹3000 OneCard Discount" },
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=oneplus+12", price: 66999.00, rating: 4.5, reviewCount: 1980, deliveryTime: "2 Days", offers: "Extra ₹2000 off on Exchange" },
        { sellerName: "Croma", sellerUrl: "https://www.croma.com/searchB?q=oneplus+12", price: 69999.00, rating: 4.4, reviewCount: 540, deliveryTime: "2-3 Days", offers: "Free OnePlus Buds Z2 included" }
      ],
      reviews: [
        { reviewerName: "Deepak Patel", rating: 5.0, reviewText: "Charges from 1% to 100% in 25 minutes! Display brightness under direct sunlight is incredible." }
      ]
    },

    // --- 2. AUDIO & HEADPHONES ---
    {
      name: "boAt Airdopes 131 True Wireless Earbuds",
      category: "Audio",
      brand: "boAt",
      imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800",
      description: "Wireless TWS Earbuds with 13mm Drivers, IWP Technology, Type-C Charging, and up to 60 Hours Total Playback.",
      listings: [
        { sellerName: "Meesho", sellerUrl: "https://meesho.com/search?q=boat+airdopes+131", price: 799.00, rating: 4.3, reviewCount: 4890, deliveryTime: "3-4 Days", offers: "Factory Direct Discount 15%" },
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=boat+airdopes+131", price: 899.00, rating: 4.2, reviewCount: 89500, deliveryTime: "Tomorrow", offers: "Save ₹100 with Coupon" },
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=boat+airdopes+131", price: 999.00, rating: 4.1, reviewCount: 65200, deliveryTime: "2 Days", offers: "5% Unlimited Cashback on Flipkart Axis Bank Card" }
      ],
      reviews: [
        { reviewerName: "Sameer Verma", rating: 4.5, reviewText: "Unbeatable value for ₹799. Deep bass and fits comfortably during workouts." },
        { reviewerName: "Kavita Rao", rating: 4.0, reviewText: "Battery backup is impressive for daily calling and listening to music." }
      ]
    },
    {
      name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
      category: "Audio",
      brand: "Sony",
      imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800",
      description: "Industry-leading Active Noise Cancellation with two processors and 8 microphones, crisp Hi-Res audio, and 30-hour battery life.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=sony+wh+1000xm5", price: 26990.00, rating: 4.7, reviewCount: 8420, deliveryTime: "Tomorrow", offers: "Instant ₹3000 Discount on HDFC Cards" },
        { sellerName: "Croma", sellerUrl: "https://www.croma.com/searchB?q=sony+wh+1000xm5", price: 28990.00, rating: 4.8, reviewCount: 1420, deliveryTime: "1-2 Days", offers: "Free Premium Carrying Case" },
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=sony+wh+1000xm5", price: 29990.00, rating: 4.6, reviewCount: 3120, deliveryTime: "2-3 Days", offers: "No Cost EMI Available" }
      ],
      reviews: [
        { reviewerName: "Rohan Kapoor", rating: 5.0, reviewText: "The noise cancellation completely blocks out flight engine noise. Audio detail is unmatched." }
      ]
    },

    // --- 3. FASHION & CLOTHING ---
    {
      name: "Levi's Men's 511 Slim Fit Stretchable Jeans",
      category: "Fashion",
      brand: "Levi's",
      imageUrl: "https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=800",
      description: "Iconic Levi's 511 slim fit denim jeans with premium stretch comfort and classic 5-pocket styling.",
      listings: [
        { sellerName: "Myntra", sellerUrl: "https://www.myntra.com/levis-511-jeans", price: 1799.00, rating: 4.6, reviewCount: 5410, deliveryTime: "2-3 Days", offers: "Flat 40% Off End of Season Sale" },
        { sellerName: "Meesho", sellerUrl: "https://meesho.com/search?q=levis+511+jeans", price: 1899.00, rating: 4.2, reviewCount: 890, deliveryTime: "4 Days", offers: "Extra 10% Off on UPI Payment" },
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=levis+511+jeans", price: 2099.00, rating: 4.4, reviewCount: 2310, deliveryTime: "2 Days", offers: "Buy 2 Get 10% Extra Off" },
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=levis+511+jeans", price: 2299.00, rating: 4.5, reviewCount: 4120, deliveryTime: "Tomorrow", offers: "Free Returns & Exchanges" }
      ],
      reviews: [
        { reviewerName: "Arjun Nambiar", rating: 5.0, reviewText: "Perfect fit! Elastane content gives just the right flexibility without losing denim shape." }
      ]
    },
    {
      name: "Women Floral Printed Pure Cotton Anarkali Kurta Set",
      category: "Fashion",
      brand: "Biba",
      imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800",
      description: "Flowy breathable 100% cotton floral print Anarkali kurta with dupatta and pants ensemble for festive occasions.",
      listings: [
        { sellerName: "Meesho", sellerUrl: "https://meesho.com/search?q=cotton+anarkali+kurta", price: 699.00, rating: 4.4, reviewCount: 7890, deliveryTime: "3-4 Days", offers: "Best Wholesale Supplier Price" },
        { sellerName: "Myntra", sellerUrl: "https://www.myntra.com/anarkali-kurta", price: 1299.00, rating: 4.6, reviewCount: 3420, deliveryTime: "2 Days", offers: "Use Coupon MYNTRA100" },
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=anarkali+kurta", price: 1499.00, rating: 4.3, reviewCount: 2150, deliveryTime: "3 Days", offers: "Bank Offer 10% Off" },
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=anarkali+kurta", price: 1699.00, rating: 4.5, reviewCount: 1840, deliveryTime: "Tomorrow", offers: "Free Delivery on First Order" }
      ],
      reviews: [
        { reviewerName: "Sneha Mukherjee", rating: 5.0, reviewText: "Fabric is soft and lightweight. Color didn't fade after machine wash!" }
      ]
    },

    // --- 4. LAPTOPS & COMPUTERS ---
    {
      name: "HP Pavilion 15 (13th Gen Intel Core i5, 16GB RAM, 512GB SSD)",
      category: "Computers",
      brand: "HP",
      imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800",
      description: "15.6-inch FHD micro-edge IPS display, Backlit Keyboard, B&O audio tuning, Intel Iris Xe Graphics, and Windows 11.",
      listings: [
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=hp+pavilion+i5", price: 53990.00, rating: 4.5, reviewCount: 1890, deliveryTime: "2 Days", offers: "Exchange discount up to ₹10000" },
        { sellerName: "Croma", sellerUrl: "https://www.croma.com/searchB?q=hp+pavilion+i5", price: 55990.00, rating: 4.6, reviewCount: 420, deliveryTime: "1-2 Days", offers: "Free Backpack & Wireless Mouse" },
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=hp+pavilion+i5", price: 57490.00, rating: 4.4, reviewCount: 3120, deliveryTime: "Tomorrow", offers: "No Cost EMI starting at ₹4791/mo" }
      ],
      reviews: [
        { reviewerName: "Tanmay Das", rating: 4.5, reviewText: "Handles coding, multitasking, and casual gaming effortlessly. Battery lasts around 6-7 hours." }
      ]
    },
    {
      name: "Apple MacBook Air M2 (13.6-inch, 8GB RAM, 256GB SSD - Midnight)",
      category: "Computers",
      brand: "Apple",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800",
      description: "Strikingly thin design with M2 chip, 13.6-inch Liquid Retina Display, 1080p FaceTime HD Camera, and up to 18 hours battery life.",
      listings: [
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=macbook+air+m2", price: 89900.00, rating: 4.8, reviewCount: 7850, deliveryTime: "Tomorrow", offers: "Flat ₹5000 Instant Savings on SBI Cards" },
        { sellerName: "Croma", sellerUrl: "https://www.croma.com/searchB?q=macbook+air+m2", price: 92900.00, rating: 4.7, reviewCount: 1680, deliveryTime: "1-2 Days", offers: "Complimentary Student Discount Package" },
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=macbook+air+m2", price: 94900.00, rating: 4.7, reviewCount: 4230, deliveryTime: "2 Days", offers: "Free Microsoft 365 1-Year Subscription" }
      ],
      reviews: [
        { reviewerName: "Karan Johar", rating: 5.0, reviewText: "M2 chip is silent and incredibly fast. Midnight color finish looks super sleek!" }
      ]
    },

    // --- 5. PERSONAL CARE & BEAUTY ---
    {
      name: "Tresemme Keratin Smooth Anti-Frizz Hair Shampoo (1 Litre)",
      category: "Personal Care",
      brand: "Tresemme",
      imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=800",
      description: "Infused with Keratin oil and Argan oil to nourish dull hair and control frizz for up to 72 hours.",
      listings: [
        { sellerName: "Meesho", sellerUrl: "https://meesho.com/search?q=tresemme+shampoo", price: 529.00, rating: 4.4, reviewCount: 950, deliveryTime: "3 Days", offers: "Direct Bulk Savings 20%" },
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=tresemme+shampoo", price: 620.00, rating: 4.5, reviewCount: 3900, deliveryTime: "2 Days", offers: "Buy 2 Get 5% Off" },
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=tresemme+shampoo", price: 680.00, rating: 4.6, reviewCount: 8200, deliveryTime: "Tomorrow", offers: "Subscribe & Save 10% Extra" }
      ],
      reviews: [
        { reviewerName: "Divya Menon", rating: 4.5, reviewText: "Controls humidity frizz really well. Pump bottle makes it convenient to use." }
      ]
    },

    // --- 6. GROCERIES & KITCHEN ESSENTIALS ---
    {
      name: "Fortune Sunlite Refined Sunflower Oil Pouch (1 Litre)",
      category: "Groceries",
      brand: "Fortune",
      imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800",
      description: "Light and healthy cooking oil enriched with Vitamins A & D, ideal for daily deep frying and healthy curries.",
      listings: [
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=fortune+sunflower+oil", price: 125.00, rating: 4.6, reviewCount: 14200, deliveryTime: "Same Day", offers: "Grocery Flash Deal" },
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=fortune+sunflower+oil", price: 132.00, rating: 4.7, reviewCount: 22100, deliveryTime: "Tomorrow", offers: "Fresh Grocery Cashback" },
        { sellerName: "Meesho", sellerUrl: "https://meesho.com/search?q=fortune+sunflower+oil", price: 135.00, rating: 4.3, reviewCount: 1120, deliveryTime: "2 Days", offers: "Free Shipping" }
      ],
      reviews: [
        { reviewerName: "Rajesh K", rating: 5.0, reviewText: "Clear quality oil without heavy odor. Good value grocery item." }
      ]
    },

    // --- 7. HOME APPLIANCES ---
    {
      name: "Philips Digital Air Fryer HD9252/90 (4.1 Litre, 1400W)",
      category: "Appliances",
      brand: "Philips",
      imageUrl: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?q=80&w=800",
      description: "Patented Rapid Air Technology cooks delicious fried food with up to 90% less oil, 7 touch screen preset menus.",
      listings: [
        { sellerName: "Meesho", sellerUrl: "https://meesho.com/search?q=philips+air+fryer", price: 5899.00, rating: 4.4, reviewCount: 620, deliveryTime: "3-4 Days", offers: "Manufacturer Warranty Direct" },
        { sellerName: "Flipkart", sellerUrl: "https://www.flipkart.com/search?q=philips+air+fryer", price: 6499.00, rating: 4.5, reviewCount: 3800, deliveryTime: "2 Days", offers: "Flat ₹500 Card Cashback" },
        { sellerName: "Amazon", sellerUrl: "https://www.amazon.in/s?k=philips+air+fryer", price: 6999.00, rating: 4.7, reviewCount: 9500, deliveryTime: "Tomorrow", offers: "Free NutriU App Recipe Book" }
      ],
      reviews: [
        { reviewerName: "Meera Sen", rating: 5.0, reviewText: "Fries chicken and samosas crisp without greasy oil! Easy to clean basket." }
      ]
    }
  ];

  let addedProducts = 0;
  let addedListings = 0;

  for (const item of products) {
    try {
      // Upsert Product
      let p = await prisma.product.findFirst({
        where: { name: item.name }
      });

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
        addedProducts++;
      } else {
        p = await prisma.product.update({
          where: { id: p.id },
          data: {
            imageUrl: item.imageUrl,
            description: item.description,
            category: item.category,
            brand: item.brand
          }
        });
      }

      // Upsert Listings for each seller
      for (const l of item.listings) {
        try {
          let listing = await prisma.productListing.findFirst({
            where: {
              productId: p.id,
              sellerName: l.sellerName
            }
          });

          if (!listing) {
            listing = await prisma.productListing.create({
              data: {
                productId: p.id,
                sellerName: l.sellerName,
                sellerUrl: l.sellerUrl,
                price: l.price,
                currency: "INR",
                rating: l.rating,
                reviewCount: l.reviewCount,
                deliveryTime: l.deliveryTime,
                offers: l.offers
              }
            });
            addedListings++;
          } else {
            listing = await prisma.productListing.update({
              where: { id: listing.id },
              data: {
                price: l.price,
                rating: l.rating,
                reviewCount: l.reviewCount,
                sellerUrl: l.sellerUrl,
                deliveryTime: l.deliveryTime,
                offers: l.offers,
                lastScrapedAt: new Date()
              }
            });
          }

          // Record Price History safely
          try {
            await prisma.priceHistory.create({
              data: {
                listingId: listing.id,
                price: l.price,
                recordedAt: new Date()
              }
            });
          } catch (e) {
            // Price history record already present or optional
          }

          // Insert customer reviews
          if (item.reviews) {
            for (const r of item.reviews) {
              try {
                const existingReview = await prisma.review.findFirst({
                  where: {
                    listingId: listing.id,
                    reviewerName: r.reviewerName
                  }
                });
                if (!existingReview) {
                  await prisma.review.create({
                    data: {
                      listingId: listing.id,
                      reviewerName: r.reviewerName,
                      rating: r.rating,
                      reviewText: r.reviewText,
                      scrapedAt: new Date()
                    }
                  });
                }
              } catch (e) {
                console.warn(`Review insertion skipped for ${r.reviewerName}:`, e.message);
              }
            }
          }
        } catch (listingErr) {
          console.warn(`Listing error for ${l.sellerName}:`, listingErr.message);
        }
      }
    } catch (productErr) {
      console.warn(`Product processing error for ${item.name}:`, productErr.message);
    }
  }

  const totalProducts = await prisma.product.count();
  const totalListings = await prisma.productListing.count();
  const totalReviews = await prisma.review.count();

  console.log(`✅ SEED COMPLETE!`);
  console.log(`📊 Catalog Stats: ${totalProducts} Products | ${totalListings} Store Listings (Amazon, Flipkart, Meesho, Croma, Myntra) | ${totalReviews} Reviews.`);

  await prisma.$disconnect();
}

seedMasterCatalog().catch(err => {
  console.error("❌ Seeding Error:", err);
  process.exit(1);
});
