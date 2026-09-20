-- ====================================================================
-- SHOPWISE AI: CLOUD DATABASE SEED (REAL PRODUCTS & STORE DEALS)
-- ====================================================================

TRUNCATE TABLE "users", "products", "product_listings", "price_history", "price_alerts", "wishlists", "reviews", "seller_reliability", "platform_recommendations", "scraper_logs" CASCADE;

INSERT INTO "users" ("id", "name", "email", "password_hash", "role", "created_at") VALUES
  ('8e778b51-133b-4f74-af9c-a2e4dc1300dc', 'Admin User', 'admin@shopwise.ai', '$2a$10$wO3nE8yQc/1t4KkLp8xMheXz.R2O2eI9XfN6BfK.r1z.Xz.R2O2eI', 'ADMIN', NOW()),
  ('24995099-7dbb-4227-b8df-1259d9cbe08a', 'Demo Shopper', 'shopper@shopwise.ai', '$2a$10$wO3nE8yQc/1t4KkLp8xMheXz.R2O2eI9XfN6BfK.r1z.Xz.R2O2eI', 'USER', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('7712202a-ff55-4e00-8834-5eb8d32a27ad', 'Apple iPhone 15 Pro (128GB, Natural Titanium)', 'Smartphones', 'Apple', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600', 'Aerospace-grade titanium design, A17 Pro Chip, 48MP main camera with customizable Action Button.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('309185a7-04fa-48a3-9858-eb53ae585fb1', '7712202a-ff55-4e00-8834-5eb8d32a27ad', 'Amazon', 'https://www.amazon.in/s?k=iphone+15+pro', 119900, 'INR', 4.7, 14200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('ec80b3fc-cdf8-4a37-bbf4-73d172af9fec', '309185a7-04fa-48a3-9858-eb53ae585fb1', 129492.00, NOW() - INTERVAL '15 days'),
  ('da1eb9dc-fe19-4fa4-9c00-5ceab1262120', '309185a7-04fa-48a3-9858-eb53ae585fb1', 119900, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('f10cc7bf-1346-4490-a7da-2f5f02c86310', '309185a7-04fa-48a3-9858-eb53ae585fb1', 'Verified Customer', 4.7, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('e319ca8d-5138-4648-b1d2-90753553eae1', '7712202a-ff55-4e00-8834-5eb8d32a27ad', 'Flipkart', 'https://www.flipkart.com/search?q=iphone+15+pro', 121900, 'INR', 4.7, 8900, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('d89567cc-e169-4dd8-bc43-f32da6071886', 'e319ca8d-5138-4648-b1d2-90753553eae1', 131652.00, NOW() - INTERVAL '15 days'),
  ('ee3de1b1-1e15-45b3-bc32-f3657f66c3f6', 'e319ca8d-5138-4648-b1d2-90753553eae1', 121900, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('89af266d-a322-44ba-a357-8b5aca0617da', 'e319ca8d-5138-4648-b1d2-90753553eae1', 'Verified Customer', 4.7, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('f52e913d-9545-41e2-a309-146f98fbbdfe', '7712202a-ff55-4e00-8834-5eb8d32a27ad', 'Croma', 'https://www.croma.com/searchB?q=iphone+15+pro', 124900, 'INR', 4.6, 1800, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('8717eb24-fcf1-4636-83fe-ffc0155fd822', 'f52e913d-9545-41e2-a309-146f98fbbdfe', 134892.00, NOW() - INTERVAL '15 days'),
  ('a3c07cee-1600-4902-a8bd-6a87da211c8b', 'f52e913d-9545-41e2-a309-146f98fbbdfe', 124900, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('e44f911a-4f62-4fe6-b0ae-3d4d89163829', 'f52e913d-9545-41e2-a309-146f98fbbdfe', 'Verified Customer', 4.6, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('970824f2-d396-4135-b706-943eb41ed3d5', '7712202a-ff55-4e00-8834-5eb8d32a27ad', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹1,19,900', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 119900, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹5,000.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('77e30907-fec8-4af5-8921-69b992d0dc18', 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB/256GB)', 'Smartphones', 'Samsung', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600', 'Galaxy AI with Circle to Search, 200MP camera, built-in S Pen, Snapdragon 8 Gen 3 for Galaxy.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('489dd5f4-c289-4b0f-a225-9856252a23a3', '77e30907-fec8-4af5-8921-69b992d0dc18', 'Amazon', 'https://www.amazon.in/s?k=samsung+galaxy+s24+ultra', 119999, 'INR', 4.6, 7800, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('fd8726ff-0e4e-4910-a11b-ea60048546ed', '489dd5f4-c289-4b0f-a225-9856252a23a3', 129598.92, NOW() - INTERVAL '15 days'),
  ('5a0c9cb2-fdd5-4784-96d4-6b71e07d86d4', '489dd5f4-c289-4b0f-a225-9856252a23a3', 119999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('460cd025-eeed-4d68-810b-4e91edf438d3', '489dd5f4-c289-4b0f-a225-9856252a23a3', 'Verified Customer', 4.6, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('851595bc-a002-48a7-9094-a2c7945ed43d', '77e30907-fec8-4af5-8921-69b992d0dc18', 'Flipkart', 'https://www.flipkart.com/search?q=samsung+galaxy+s24+ultra', 121999, 'INR', 4.6, 5400, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('486c3281-2a82-4a4e-8447-4f236417d154', '851595bc-a002-48a7-9094-a2c7945ed43d', 131758.92, NOW() - INTERVAL '15 days'),
  ('80b8dd5b-d778-4aa8-9074-7ec5a0bac79e', '851595bc-a002-48a7-9094-a2c7945ed43d', 121999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('c33ab8c3-74a8-439d-b75a-6293d7a4c19a', '851595bc-a002-48a7-9094-a2c7945ed43d', 'Verified Customer', 4.6, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('29748a88-8709-47cd-9b7e-1dfe55f41dae', '77e30907-fec8-4af5-8921-69b992d0dc18', 'Croma', 'https://www.croma.com/searchB?q=samsung+galaxy+s24+ultra', 124999, 'INR', 4.5, 920, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('e877abfe-c294-4a81-bc66-ec2138dd566c', '29748a88-8709-47cd-9b7e-1dfe55f41dae', 134998.92, NOW() - INTERVAL '15 days'),
  ('39338f95-d8dc-4633-9c12-2a7dda76fe2d', '29748a88-8709-47cd-9b7e-1dfe55f41dae', 124999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('6d3f692f-40e6-4627-8785-e5d6c73c1ca6', '29748a88-8709-47cd-9b7e-1dfe55f41dae', 'Verified Customer', 4.5, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('9ada704c-4cc8-4544-ae70-50daf987d928', '77e30907-fec8-4af5-8921-69b992d0dc18', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹1,19,999', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 119999, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹5,000.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('968e20af-24fb-42bd-82c1-b99fad2a56a5', 'OnePlus 12 5G (Silky Black, 16GB RAM, 512GB Storage)', 'Smartphones', 'OnePlus', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=600', '4th Gen Hasselblad Camera System, Snapdragon 8 Gen 3, 5400mAh Battery with 100W SUPERVOOC charging.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('ca064153-dee3-4f96-9c05-df1ef672eb8d', '968e20af-24fb-42bd-82c1-b99fad2a56a5', 'Amazon', 'https://www.amazon.in/s?k=oneplus+12', 58999, 'INR', 4.5, 6200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('783568a8-c457-4a90-8466-31f1ef53a7fc', 'ca064153-dee3-4f96-9c05-df1ef672eb8d', 63718.92, NOW() - INTERVAL '15 days'),
  ('a2b4a97e-061d-4ceb-bfe3-38d394301d68', 'ca064153-dee3-4f96-9c05-df1ef672eb8d', 58999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('93b6085e-58af-4f0d-a4a4-bdae1f5c7247', 'ca064153-dee3-4f96-9c05-df1ef672eb8d', 'Verified Customer', 4.5, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('23f754da-8d23-47e3-a0e0-e5b63a2958fb', '968e20af-24fb-42bd-82c1-b99fad2a56a5', 'Flipkart', 'https://www.flipkart.com/search?q=oneplus+12', 59999, 'INR', 4.5, 3900, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('52883d50-990a-470a-89c4-d3e0d6ff9fe5', '23f754da-8d23-47e3-a0e0-e5b63a2958fb', 64798.92, NOW() - INTERVAL '15 days'),
  ('57842b3b-363d-451c-8fca-9bce558d1855', '23f754da-8d23-47e3-a0e0-e5b63a2958fb', 59999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('f484df6d-32af-4434-9b24-3daf44f24289', '23f754da-8d23-47e3-a0e0-e5b63a2958fb', 'Verified Customer', 4.5, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('9a25eccb-9b67-4d07-932f-8881a632eb23', '968e20af-24fb-42bd-82c1-b99fad2a56a5', 'Croma', 'https://www.croma.com/searchB?q=oneplus+12', 61999, 'INR', 4.4, 480, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('7818622f-f223-4c2f-a09d-85116c5e62fa', '9a25eccb-9b67-4d07-932f-8881a632eb23', 66958.92, NOW() - INTERVAL '15 days'),
  ('011518b7-771f-4116-8b07-e1f0fc42777b', '9a25eccb-9b67-4d07-932f-8881a632eb23', 61999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('61c82386-f990-46fc-8c34-2b6c61f946aa', '9a25eccb-9b67-4d07-932f-8881a632eb23', 'Verified Customer', 4.4, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('00884d99-23c6-4929-a931-8a0e4b51664b', '968e20af-24fb-42bd-82c1-b99fad2a56a5', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹58,999', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 58999, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹3,000.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('e55c6e75-b386-4acb-a02a-f0084e42c9e7', 'Google Pixel 8 Pro 5G (Obsidian, 128GB)', 'Smartphones', 'Google', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600', 'Google Tensor G3, Super Actua display, Pro camera controls with Best Take, Audio Magic Eraser.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('2c497f38-0ca4-48b3-91ee-3428558064e8', 'e55c6e75-b386-4acb-a02a-f0084e42c9e7', 'Flipkart', 'https://www.flipkart.com/search?q=pixel+8+pro', 79999, 'INR', 4.4, 3200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('c150648f-bec9-4630-b1e4-9ea0cc5fa35d', '2c497f38-0ca4-48b3-91ee-3428558064e8', 86398.92, NOW() - INTERVAL '15 days'),
  ('e4e7fcd0-8592-4b0d-ab52-4a086c8ea248', '2c497f38-0ca4-48b3-91ee-3428558064e8', 79999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('b16153ec-58e6-4646-9e34-a196995266c3', '2c497f38-0ca4-48b3-91ee-3428558064e8', 'Verified Customer', 4.4, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('d756ce7c-1cf7-4ee6-88b2-4ec09bba39f6', 'e55c6e75-b386-4acb-a02a-f0084e42c9e7', 'Amazon', 'https://www.amazon.in/s?k=pixel+8+pro', 81999, 'INR', 4.4, 2100, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('a634d228-901f-4ce9-8504-c11fb55a9d27', 'd756ce7c-1cf7-4ee6-88b2-4ec09bba39f6', 88558.92, NOW() - INTERVAL '15 days'),
  ('674317ef-8341-44a5-8d1a-bacbb0d6f8e7', 'd756ce7c-1cf7-4ee6-88b2-4ec09bba39f6', 81999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('9521908e-7b2c-490f-b9cd-4cafc5c5a257', 'd756ce7c-1cf7-4ee6-88b2-4ec09bba39f6', 'Verified Customer', 4.4, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('9e615a4d-0b7f-455f-88eb-637133618e55', 'e55c6e75-b386-4acb-a02a-f0084e42c9e7', 'Croma', 'https://www.croma.com/searchB?q=pixel+8+pro', 84999, 'INR', 4.3, 340, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('8ecb499c-271a-4357-8a6f-d764f1a5d79d', '9e615a4d-0b7f-455f-88eb-637133618e55', 91798.92, NOW() - INTERVAL '15 days'),
  ('ae6b3a45-6a85-4808-a2f1-3c70f470a56e', '9e615a4d-0b7f-455f-88eb-637133618e55', 84999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('71d5e054-3a38-454b-b6d5-130c5dfca50c', '9e615a4d-0b7f-455f-88eb-637133618e55', 'Verified Customer', 4.3, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('baecfff6-f911-4277-8ea0-683786e68c94', 'e55c6e75-b386-4acb-a02a-f0084e42c9e7', 'Flipkart', 95, ARRAY['Lowest authenticated price verified at ₹79,999', 'Guaranteed genuine warranty & authorized seller fulfillment on Flipkart', 'Fast express dispatch with 7-day hassle-free replacement'], 79999, 'Flipkart', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Flipkart for maximum savings of ₹5,000.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('ff8266f9-724e-4e0f-82ec-978ca8bd5de1', 'Apple iPad Air M2 (11-inch, Wi-Fi, 128GB, Space Grey)', 'Smartphones', 'Apple', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600', 'Stunning 11-inch Liquid Retina display with M2 chip, Landscape 12MP front camera, support for Apple Pencil Pro.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('4b5319ee-5490-4df1-b1e2-65fb45d2c871', 'ff8266f9-724e-4e0f-82ec-978ca8bd5de1', 'Amazon', 'https://www.amazon.in/s?k=ipad+air+m2', 54900, 'INR', 4.7, 4100, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('0b811af9-f6ae-4d40-a6b4-27fd28318f6a', '4b5319ee-5490-4df1-b1e2-65fb45d2c871', 59292.00, NOW() - INTERVAL '15 days'),
  ('e02e9637-afd2-431d-8a2a-8f5e751e5e91', '4b5319ee-5490-4df1-b1e2-65fb45d2c871', 54900, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('ece531f6-6f4d-4ef8-b939-e6aa24a5b954', '4b5319ee-5490-4df1-b1e2-65fb45d2c871', 'Verified Customer', 4.7, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('f0278d17-5096-4a7b-bbbc-6437f04779d4', 'ff8266f9-724e-4e0f-82ec-978ca8bd5de1', 'Flipkart', 'https://www.flipkart.com/search?q=ipad+air+m2', 55900, 'INR', 4.7, 2800, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('5d21169a-0e45-46cb-869b-e8c04338935f', 'f0278d17-5096-4a7b-bbbc-6437f04779d4', 60372.00, NOW() - INTERVAL '15 days'),
  ('6c4c501d-bf46-4699-a831-265c2ca5783b', 'f0278d17-5096-4a7b-bbbc-6437f04779d4', 55900, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('63547493-7bac-4f52-abd7-a40e4a67d4ef', 'f0278d17-5096-4a7b-bbbc-6437f04779d4', 'Verified Customer', 4.7, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('4de29f44-1109-4c77-8586-bf2346ade519', 'ff8266f9-724e-4e0f-82ec-978ca8bd5de1', 'Croma', 'https://www.croma.com/searchB?q=ipad+air+m2', 57900, 'INR', 4.6, 650, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('ab53f94c-5e56-4c68-bbf4-f2493239f603', '4de29f44-1109-4c77-8586-bf2346ade519', 62532.00, NOW() - INTERVAL '15 days'),
  ('8b876c10-7d20-45b3-99aa-47ebf0fe8672', '4de29f44-1109-4c77-8586-bf2346ade519', 57900, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('7c9ecfe4-fbea-457b-aea4-ccb53522261f', '4de29f44-1109-4c77-8586-bf2346ade519', 'Verified Customer', 4.6, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('031bf6c8-fbbe-418c-a678-a76141302961', 'ff8266f9-724e-4e0f-82ec-978ca8bd5de1', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹54,900', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 54900, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹3,000.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('238d7b56-22e4-44a1-a23a-bdef571e3a10', 'boAt Airdopes Alpha True Wireless Earbuds', 'Audio', 'boAt', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600', '35H Playtime, 13mm Drivers, Dual Mics ENx Tech, ASAP Charge (10 mins = 120 mins playback), IPX5 Water Resistance.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('384cc656-8fa3-4139-9fc3-b8885edfdc81', '238d7b56-22e4-44a1-a23a-bdef571e3a10', 'Flipkart', 'https://www.flipkart.com/search?q=boat+airdopes+alpha', 1149, 'INR', 4.3, 15420, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('146dea37-31f7-4a55-93d3-3d9cc12996c1', '384cc656-8fa3-4139-9fc3-b8885edfdc81', 1240.92, NOW() - INTERVAL '15 days'),
  ('5f1807e7-46cf-4c82-8499-02ae655aab9b', '384cc656-8fa3-4139-9fc3-b8885edfdc81', 1149, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('a5154399-cb71-483e-8941-03977ebda9e5', '384cc656-8fa3-4139-9fc3-b8885edfdc81', 'Verified Customer', 4.3, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('11af9730-b441-4569-ad3a-471cdce90239', '238d7b56-22e4-44a1-a23a-bdef571e3a10', 'Amazon', 'https://www.amazon.in/s?k=boat+airdopes+alpha', 1199, 'INR', 4.4, 24500, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('6130bc4c-757d-4947-b328-a209eaf65bfd', '11af9730-b441-4569-ad3a-471cdce90239', 1294.92, NOW() - INTERVAL '15 days'),
  ('8190ae5f-fd6e-4698-800f-d35fa50c626a', '11af9730-b441-4569-ad3a-471cdce90239', 1199, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('9c782c17-2b5d-475d-95a3-e1877c935a5c', '11af9730-b441-4569-ad3a-471cdce90239', 'Verified Customer', 4.4, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('d3690c82-fb42-40e6-92ed-112f1c6b45ca', '238d7b56-22e4-44a1-a23a-bdef571e3a10', 'Croma', 'https://www.croma.com/searchB?q=boat+airdopes+alpha', 1299, 'INR', 4.2, 420, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('6b110c54-303c-485b-a271-27c64e133bb0', 'd3690c82-fb42-40e6-92ed-112f1c6b45ca', 1402.92, NOW() - INTERVAL '15 days'),
  ('364d34aa-b682-4872-b5d5-1414af952a2d', 'd3690c82-fb42-40e6-92ed-112f1c6b45ca', 1299, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('b30c9c62-4b5b-4fe9-becb-c4f89955ba44', 'd3690c82-fb42-40e6-92ed-112f1c6b45ca', 'Verified Customer', 4.2, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('3a7c9cb3-ab3d-4c56-af07-601e88d079f3', '238d7b56-22e4-44a1-a23a-bdef571e3a10', 'Flipkart', 95, ARRAY['Lowest authenticated price verified at ₹1,149', 'Guaranteed genuine warranty & authorized seller fulfillment on Flipkart', 'Fast express dispatch with 7-day hassle-free replacement'], 1149, 'Flipkart', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Flipkart for maximum savings of ₹150.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('5a1fa8a5-b3fc-4411-80e0-5c825674b4e9', 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', 'Audio', 'Sony', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600', 'Industry Leading Noise Cancellation with 8 Mics, Auto NC Optimizer, 30H Battery Life, Touch Control, Hi-Res Audio Wireless.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('580c5794-04a3-49a9-9a52-41fc21f7d4ec', '5a1fa8a5-b3fc-4411-80e0-5c825674b4e9', 'Amazon', 'https://www.amazon.in/s?k=sony+wh-1000xm5', 28990, 'INR', 4.6, 8900, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('12282a48-72ec-4137-b99c-5765c1b6ae68', '580c5794-04a3-49a9-9a52-41fc21f7d4ec', 31309.20, NOW() - INTERVAL '15 days'),
  ('2e12751c-c4ad-4e0b-863f-ff5dc3953f03', '580c5794-04a3-49a9-9a52-41fc21f7d4ec', 28990, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('4550886e-5442-4e6e-885a-6ad86b78bca6', '580c5794-04a3-49a9-9a52-41fc21f7d4ec', 'Verified Customer', 4.6, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('804fd7d3-8e9a-4e00-8408-0fdff3a1984e', '5a1fa8a5-b3fc-4411-80e0-5c825674b4e9', 'Flipkart', 'https://www.flipkart.com/search?q=sony+wh-1000xm5', 29990, 'INR', 4.6, 3410, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('f82437cc-2eec-48a3-8370-0f607bc926b3', '804fd7d3-8e9a-4e00-8408-0fdff3a1984e', 32389.20, NOW() - INTERVAL '15 days'),
  ('10b993ed-b801-406c-96a9-548f48c2193b', '804fd7d3-8e9a-4e00-8408-0fdff3a1984e', 29990, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('9e852bb3-8fd8-4bbf-a446-c40e0a89b011', '804fd7d3-8e9a-4e00-8408-0fdff3a1984e', 'Verified Customer', 4.6, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('92cb1032-e922-4322-b220-8dc185237432', '5a1fa8a5-b3fc-4411-80e0-5c825674b4e9', 'Croma', 'https://www.croma.com/searchB?q=sony+wh-1000xm5', 31990, 'INR', 4.5, 512, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('00737df5-9d72-47c0-8c63-a1e0fe600736', '92cb1032-e922-4322-b220-8dc185237432', 34549.20, NOW() - INTERVAL '15 days'),
  ('3c5817ba-e718-449b-b1c6-40382bdb9609', '92cb1032-e922-4322-b220-8dc185237432', 31990, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('66fa48b9-d443-4334-8b18-1aebbcadc770', '92cb1032-e922-4322-b220-8dc185237432', 'Verified Customer', 4.5, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('b833018f-8ed5-46b8-90f2-ae387c307080', '5a1fa8a5-b3fc-4411-80e0-5c825674b4e9', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹28,990', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 28990, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹3,000.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('a10d2ca9-039d-4461-9e1c-356b070cb516', 'Apple AirPods Pro (2nd Generation, USB-C MagSafe Case)', 'Audio', 'Apple', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600', 'Up to 2x more Active Noise Cancellation, Transparency mode, Personalized Spatial Audio, USB-C charging.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('3c9f8b46-fc33-4f77-b5d1-6be741c95050', 'a10d2ca9-039d-4461-9e1c-356b070cb516', 'Amazon', 'https://www.amazon.in/s?k=airpods+pro+2', 21990, 'INR', 4.7, 12400, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('03052d91-2de6-4c06-a2c1-ed05281fe5c5', '3c9f8b46-fc33-4f77-b5d1-6be741c95050', 23749.20, NOW() - INTERVAL '15 days'),
  ('223d0a64-8be9-4930-abbd-1d77471d426a', '3c9f8b46-fc33-4f77-b5d1-6be741c95050', 21990, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('5095dace-4426-49f4-828a-415ad0312406', '3c9f8b46-fc33-4f77-b5d1-6be741c95050', 'Verified Customer', 4.7, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('ffdb9410-6df5-4628-bc8f-e0fd2404e8e9', 'a10d2ca9-039d-4461-9e1c-356b070cb516', 'Flipkart', 'https://www.flipkart.com/search?q=airpods+pro+2', 22490, 'INR', 4.7, 8900, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('31428501-2b30-463d-a7b2-7cacbcd223f9', 'ffdb9410-6df5-4628-bc8f-e0fd2404e8e9', 24289.20, NOW() - INTERVAL '15 days'),
  ('2209ee02-8e9f-49d2-8085-aedd682ee614', 'ffdb9410-6df5-4628-bc8f-e0fd2404e8e9', 22490, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('ce046384-e7d9-4000-bbc5-97f5d77c6b1b', 'ffdb9410-6df5-4628-bc8f-e0fd2404e8e9', 'Verified Customer', 4.7, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('06a7cfa8-20e1-4c3d-83cb-845d59e9add6', 'a10d2ca9-039d-4461-9e1c-356b070cb516', 'Croma', 'https://www.croma.com/searchB?q=airpods+pro+2', 23900, 'INR', 4.6, 1100, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('7dc2a467-e84e-4e1f-8494-b9089e17ab22', '06a7cfa8-20e1-4c3d-83cb-845d59e9add6', 25812.00, NOW() - INTERVAL '15 days'),
  ('3e46b8ae-b664-4049-8acd-398cc789ce07', '06a7cfa8-20e1-4c3d-83cb-845d59e9add6', 23900, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('79fce40c-5232-469b-9516-c0438ba9a512', '06a7cfa8-20e1-4c3d-83cb-845d59e9add6', 'Verified Customer', 4.6, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('8a9b8c68-f775-4a31-b54c-7d610edb40e2', 'a10d2ca9-039d-4461-9e1c-356b070cb516', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹21,990', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 21990, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹1,910.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('14531444-cd66-4f3a-a154-cfe13e05111f', 'JBL Flip 6 Waterproof Portable Bluetooth Speaker (30W)', 'Audio', 'JBL', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600', '2-way speaker system, bold JBL Original Pro Sound, IP67 waterproof & dustproof, 12 hours playtime.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('ad5ac802-bbcf-4ad8-a4ff-69ceb14363ed', '14531444-cd66-4f3a-a154-cfe13e05111f', 'Amazon', 'https://www.amazon.in/s?k=jbl+flip+6', 9999, 'INR', 4.5, 14500, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('071cc183-3b43-4704-b357-9abc8d8d4984', 'ad5ac802-bbcf-4ad8-a4ff-69ceb14363ed', 10798.92, NOW() - INTERVAL '15 days'),
  ('8ba10f0a-bcda-477d-a9c1-6d01b6cce69d', 'ad5ac802-bbcf-4ad8-a4ff-69ceb14363ed', 9999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('a224fa98-392e-4a15-a2dd-20b9a5a9d9a9', 'ad5ac802-bbcf-4ad8-a4ff-69ceb14363ed', 'Verified Customer', 4.5, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('b573b801-d3db-4b5b-a5e9-955923cd2fea', '14531444-cd66-4f3a-a154-cfe13e05111f', 'Flipkart', 'https://www.flipkart.com/search?q=jbl+flip+6', 10499, 'INR', 4.5, 9200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('af183e4f-0386-4fc0-ab0d-764532f061f7', 'b573b801-d3db-4b5b-a5e9-955923cd2fea', 11338.92, NOW() - INTERVAL '15 days'),
  ('73148876-ca4b-452d-a1b0-859697e84762', 'b573b801-d3db-4b5b-a5e9-955923cd2fea', 10499, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('4ebef9e1-e17d-4846-afc7-aa20bc3ae783', 'b573b801-d3db-4b5b-a5e9-955923cd2fea', 'Verified Customer', 4.5, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('cc76c17d-7789-4944-ab38-f3a9f787bfee', '14531444-cd66-4f3a-a154-cfe13e05111f', 'Croma', 'https://www.croma.com/searchB?q=jbl+flip+6', 10999, 'INR', 4.4, 1200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('61d16ca7-27f1-4365-b6ab-75f85c38582b', 'cc76c17d-7789-4944-ab38-f3a9f787bfee', 11878.92, NOW() - INTERVAL '15 days'),
  ('380d78e4-a41b-4bbd-8408-b3877f541dc1', 'cc76c17d-7789-4944-ab38-f3a9f787bfee', 10999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('f6fa0c55-71c5-4128-a6cd-d3b2e6be786c', 'cc76c17d-7789-4944-ab38-f3a9f787bfee', 'Verified Customer', 4.4, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('2c2a8fb0-4f8a-4bf2-8fc4-47421cc4b9dc', '14531444-cd66-4f3a-a154-cfe13e05111f', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹9,999', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 9999, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹1,000.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('e83cc2b8-53d8-4749-8670-307007eaf336', 'boAt Rockerz 450 Bluetooth On-Ear Headphones with 15H Playback', 'Audio', 'boAt', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=600', '40mm drivers for punchy HD sound, padded ear cushions, dual modes (Bluetooth & AUX), up to 15 hours battery.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('8eafd4d3-31c3-471d-9c16-87157dd332a4', 'e83cc2b8-53d8-4749-8670-307007eaf336', 'Flipkart', 'https://www.flipkart.com/search?q=boat+rockerz+450', 1249, 'INR', 4.3, 38000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('ec17ec0b-4eba-47ed-a004-bdb32289c3dc', '8eafd4d3-31c3-471d-9c16-87157dd332a4', 1348.92, NOW() - INTERVAL '15 days'),
  ('8b63f7fb-9c92-47ac-b281-0601f524ca66', '8eafd4d3-31c3-471d-9c16-87157dd332a4', 1249, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('369c6695-4679-41eb-9afe-fc9e65988128', '8eafd4d3-31c3-471d-9c16-87157dd332a4', 'Verified Customer', 4.3, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('daa2fbad-246a-44c2-bcf6-8218e26cfa84', 'e83cc2b8-53d8-4749-8670-307007eaf336', 'Amazon', 'https://www.amazon.in/s?k=boat+rockerz+450', 1299, 'INR', 4.3, 45000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('9bba1534-e30a-4cd5-b3ae-e779dede471d', 'daa2fbad-246a-44c2-bcf6-8218e26cfa84', 1402.92, NOW() - INTERVAL '15 days'),
  ('2deea846-6e83-47a3-a87c-f06ccd680e7b', 'daa2fbad-246a-44c2-bcf6-8218e26cfa84', 1299, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('7898689b-278c-4981-a019-87786caa40da', 'daa2fbad-246a-44c2-bcf6-8218e26cfa84', 'Verified Customer', 4.3, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('49112c20-cb88-4e9a-a306-3f7be1226901', 'e83cc2b8-53d8-4749-8670-307007eaf336', 'Croma', 'https://www.croma.com/searchB?q=boat+rockerz+450', 1499, 'INR', 4.2, 940, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('a2594a6e-80f9-439e-b491-c618632a4574', '49112c20-cb88-4e9a-a306-3f7be1226901', 1618.92, NOW() - INTERVAL '15 days'),
  ('eacc17b4-bdaf-4559-a8fb-7e41f19c06a2', '49112c20-cb88-4e9a-a306-3f7be1226901', 1499, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('18d7d8e0-e99f-407b-a8a5-22f0535bdfe9', '49112c20-cb88-4e9a-a306-3f7be1226901', 'Verified Customer', 4.2, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('d5b1ef59-9d1f-4360-9d93-ef80a4a04560', 'e83cc2b8-53d8-4749-8670-307007eaf336', 'Flipkart', 95, ARRAY['Lowest authenticated price verified at ₹1,249', 'Guaranteed genuine warranty & authorized seller fulfillment on Flipkart', 'Fast express dispatch with 7-day hassle-free replacement'], 1249, 'Flipkart', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Flipkart for maximum savings of ₹250.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('ade2b914-1c94-4b12-9d06-acd09c4aaf4b', 'K8 Wireless Lavalier Microphone for Type-C & iPhone', 'Audio', 'Generic', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600', 'Plug and Play Wireless Lapel Mic with Noise Reduction, 20m Range, ideal for Vloggers, YouTube, and Online Meetings.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('9a0fd98f-bf41-4ce4-a6bb-14fed2d76e32', 'ade2b914-1c94-4b12-9d06-acd09c4aaf4b', 'Amazon', 'https://www.amazon.in/s?k=k8+wireless+microphone', 299, 'INR', 4.1, 6500, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('144570e7-f01f-40da-b925-cdf56a6ff50d', '9a0fd98f-bf41-4ce4-a6bb-14fed2d76e32', 322.92, NOW() - INTERVAL '15 days'),
  ('c41ec6f2-2c37-4e24-a76d-8e4418d9c6b6', '9a0fd98f-bf41-4ce4-a6bb-14fed2d76e32', 299, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('5ef63936-e28e-4a6f-92f0-11af001c78a8', '9a0fd98f-bf41-4ce4-a6bb-14fed2d76e32', 'Verified Customer', 4.1, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('2ed59edc-07bc-4758-a2f2-599c3770a9ac', 'ade2b914-1c94-4b12-9d06-acd09c4aaf4b', 'Flipkart', 'https://www.flipkart.com/search?q=k8+wireless+microphone', 319, 'INR', 4, 8900, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('236d3b9c-22ea-4168-a718-cee60ebfb80c', '2ed59edc-07bc-4758-a2f2-599c3770a9ac', 344.52, NOW() - INTERVAL '15 days'),
  ('0de3ca83-a5da-4ac3-afe0-3b39db4e5c5b', '2ed59edc-07bc-4758-a2f2-599c3770a9ac', 319, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('d5b6d3f2-80e2-4751-8087-3e9553f1da81', '2ed59edc-07bc-4758-a2f2-599c3770a9ac', 'Verified Customer', 4, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('dcb2e98f-cf23-425b-935a-207473f927ec', 'ade2b914-1c94-4b12-9d06-acd09c4aaf4b', 'Croma', 'https://www.croma.com/searchB?q=wireless+microphone', 449, 'INR', 4, 150, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('48f06aa2-8078-44f9-8032-9e8432f75257', 'dcb2e98f-cf23-425b-935a-207473f927ec', 484.92, NOW() - INTERVAL '15 days'),
  ('c1097bd2-e0fc-4bae-94fb-6c0730ee9a8a', 'dcb2e98f-cf23-425b-935a-207473f927ec', 449, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('ddf4f8b7-b514-4265-9876-bf45b3bbc0a2', 'dcb2e98f-cf23-425b-935a-207473f927ec', 'Verified Customer', 4, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('8c0f4ea0-0d0d-490f-8683-bb293a7e5c2d', 'ade2b914-1c94-4b12-9d06-acd09c4aaf4b', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹299', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 299, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹150.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('45ec4b72-3486-4777-9340-3b187727faa9', 'Boya BY-M1 Omnidirectional Lavalier Lapel Microphone (for DSLR & Smartphone)', 'Audio', 'Boya', 'https://images.unsplash.com/photo-1520523839898-5071282543e2?q=80&w=600', 'High-quality condenser microphone with 6m cable, 3.5mm 4-pole gold plug, ideal for podcasting and content creation.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('a1027198-7eac-4afe-98b7-cb7f92dd4de6', '45ec4b72-3486-4777-9340-3b187727faa9', 'Amazon', 'https://www.amazon.in/s?k=boya+by-m1', 699, 'INR', 4.3, 32000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('fa9a5d9a-dcac-43a5-902d-9e76964241c4', 'a1027198-7eac-4afe-98b7-cb7f92dd4de6', 754.92, NOW() - INTERVAL '15 days'),
  ('fabe9837-e0c8-472e-95a0-b8a6a12db0dd', 'a1027198-7eac-4afe-98b7-cb7f92dd4de6', 699, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('5a5b2197-1310-40e0-84af-22031cce7635', 'a1027198-7eac-4afe-98b7-cb7f92dd4de6', 'Verified Customer', 4.3, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('d3981def-be01-456c-954e-01fc47199c23', '45ec4b72-3486-4777-9340-3b187727faa9', 'Flipkart', 'https://www.flipkart.com/search?q=boya+by-m1', 749, 'INR', 4.3, 19000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('cc922008-5ee2-487a-8fe2-2a1a18aa78a5', 'd3981def-be01-456c-954e-01fc47199c23', 808.92, NOW() - INTERVAL '15 days'),
  ('745aad18-5652-45b1-91bc-2b95fac06274', 'd3981def-be01-456c-954e-01fc47199c23', 749, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('16896c52-ea98-4a79-a253-123a12884a24', 'd3981def-be01-456c-954e-01fc47199c23', 'Verified Customer', 4.3, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('bebba5a7-e6c8-4a8b-9579-1793af22a5e3', '45ec4b72-3486-4777-9340-3b187727faa9', 'Croma', 'https://www.croma.com/searchB?q=boya+by-m1', 899, 'INR', 4.2, 310, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('3177d761-f2da-4a82-8e32-23b2fd5e77aa', 'bebba5a7-e6c8-4a8b-9579-1793af22a5e3', 970.92, NOW() - INTERVAL '15 days'),
  ('e225a7b1-2484-4be0-8fdc-c374d564a404', 'bebba5a7-e6c8-4a8b-9579-1793af22a5e3', 899, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('02def11e-fb0e-4a59-b7ea-8524fd122894', 'bebba5a7-e6c8-4a8b-9579-1793af22a5e3', 'Verified Customer', 4.2, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('315a5b16-2eb3-4ccc-838b-f04eb1e54898', '45ec4b72-3486-4777-9340-3b187727faa9', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹699', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 699, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹200.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('cce52a82-f41e-41e2-8f15-b550aba9140f', 'Apple MacBook Air M3 2024 (13.6-inch, 8GB RAM, 256GB SSD, Midnight)', 'Computers', 'Apple', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600', 'Lean, mean M3 chip, 13.6-inch Liquid Retina display, up to 18 hours battery life, 1080p FaceTime HD camera.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('021237d2-a88e-41bf-a957-fb03161710ba', 'cce52a82-f41e-41e2-8f15-b550aba9140f', 'Amazon', 'https://www.amazon.in/s?k=macbook+air+m3', 99990, 'INR', 4.8, 3400, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('3578447a-abf7-4bec-baff-3377fc9ee357', '021237d2-a88e-41bf-a957-fb03161710ba', 107989.20, NOW() - INTERVAL '15 days'),
  ('e99b2da3-d8d1-40a5-945e-f1bf9d14219c', '021237d2-a88e-41bf-a957-fb03161710ba', 99990, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('de1704b8-116e-4d0f-b9bd-cb48fe4a6d31', '021237d2-a88e-41bf-a957-fb03161710ba', 'Verified Customer', 4.8, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('5d27235b-776a-4ff3-a627-7927fb832ba8', 'cce52a82-f41e-41e2-8f15-b550aba9140f', 'Flipkart', 'https://www.flipkart.com/search?q=macbook+air+m3', 101990, 'INR', 4.7, 1900, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('2191839c-421e-42d1-ae71-d1cc453865ea', '5d27235b-776a-4ff3-a627-7927fb832ba8', 110149.20, NOW() - INTERVAL '15 days'),
  ('def4ed32-79a1-4c5c-9d85-68889f087df8', '5d27235b-776a-4ff3-a627-7927fb832ba8', 101990, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('44ae2c2b-0827-4efe-8f3f-a28ee71221e2', '5d27235b-776a-4ff3-a627-7927fb832ba8', 'Verified Customer', 4.7, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('30e81bd1-5d8b-48ec-ab44-0ad09788f0ca', 'cce52a82-f41e-41e2-8f15-b550aba9140f', 'Croma', 'https://www.croma.com/searchB?q=macbook+air+m3', 104900, 'INR', 4.7, 890, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('2936ba3f-a5fb-45b0-baf0-5f8a96624610', '30e81bd1-5d8b-48ec-ab44-0ad09788f0ca', 113292.00, NOW() - INTERVAL '15 days'),
  ('9dec80ab-ea8b-4e6e-9ea7-3c3591e2a0cc', '30e81bd1-5d8b-48ec-ab44-0ad09788f0ca', 104900, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('e35e06fd-ed7b-454a-a4a7-97f04ed1bd03', '30e81bd1-5d8b-48ec-ab44-0ad09788f0ca', 'Verified Customer', 4.7, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('416d0ff0-e053-4007-95d8-c322564da428', 'cce52a82-f41e-41e2-8f15-b550aba9140f', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹99,990', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 99990, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹4,910.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('41797fd3-ea0a-44f5-a2bb-9b98ebf956cc', 'Apple MacBook Pro M3 Pro (14.2-inch, 18GB RAM, 512GB SSD, Space Black)', 'Computers', 'Apple', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600', 'Phenomenal Liquid Retina XDR display with 120Hz ProMotion, M3 Pro 11-core CPU and 14-core GPU, up to 22h battery life.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('412d948f-27e2-4aa0-9e58-6a61224668bb', '41797fd3-ea0a-44f5-a2bb-9b98ebf956cc', 'Amazon', 'https://www.amazon.in/s?k=macbook+pro+m3', 189900, 'INR', 4.8, 1400, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('3fc0ae08-b239-4579-aa00-d31ca0c929af', '412d948f-27e2-4aa0-9e58-6a61224668bb', 205092.00, NOW() - INTERVAL '15 days'),
  ('0f2851ff-64df-4738-96f8-63ca8e7af0de', '412d948f-27e2-4aa0-9e58-6a61224668bb', 189900, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('f6f6ac9e-d43d-4a22-ba68-f219532a3b95', '412d948f-27e2-4aa0-9e58-6a61224668bb', 'Verified Customer', 4.8, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('76936742-9004-4161-91cb-4e9e020ee29f', '41797fd3-ea0a-44f5-a2bb-9b98ebf956cc', 'Flipkart', 'https://www.flipkart.com/search?q=macbook+pro+m3', 192900, 'INR', 4.8, 920, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('c68e12f5-3816-4a6f-a330-463db00d74be', '76936742-9004-4161-91cb-4e9e020ee29f', 208332.00, NOW() - INTERVAL '15 days'),
  ('db0d0735-ed2e-433c-9ff1-6ecdf386b1ce', '76936742-9004-4161-91cb-4e9e020ee29f', 192900, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('044a4ef3-d829-405a-8765-22675db92a9c', '76936742-9004-4161-91cb-4e9e020ee29f', 'Verified Customer', 4.8, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('2cf08f17-2127-47e7-8f5f-960d8d400dd9', '41797fd3-ea0a-44f5-a2bb-9b98ebf956cc', 'Croma', 'https://www.croma.com/searchB?q=macbook+pro+m3', 194900, 'INR', 4.7, 450, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('08a657c7-22c8-4351-be5c-887c4578c8e6', '2cf08f17-2127-47e7-8f5f-960d8d400dd9', 210492.00, NOW() - INTERVAL '15 days'),
  ('8979f004-a27f-4150-ba7d-861f902306eb', '2cf08f17-2127-47e7-8f5f-960d8d400dd9', 194900, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('d0c3062c-dfb5-4c25-9786-4e6ed80ffdfc', '2cf08f17-2127-47e7-8f5f-960d8d400dd9', 'Verified Customer', 4.7, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('5592634f-7e1e-44f3-9b70-e1e2cb768dfe', '41797fd3-ea0a-44f5-a2bb-9b98ebf956cc', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹1,89,900', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 189900, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹5,000.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('289a400d-ed31-44db-babc-57dab4816907', 'HP Pavilion 15 (13th Gen Intel Core i5, 16GB RAM, 512GB SSD, FHD IPS)', 'Computers', 'HP', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600', 'Intel Core i5-1335U, Intel Iris Xe graphics, 15.6-inch micro-edge display, Audio by B&O, Backlit Keyboard.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('1a868c2d-e8aa-4670-8964-85217aac886b', '289a400d-ed31-44db-babc-57dab4816907', 'Amazon', 'https://www.amazon.in/s?k=hp+pavilion+15', 58990, 'INR', 4.3, 4200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('08255abd-93ef-4d0a-8c97-324247a56975', '1a868c2d-e8aa-4670-8964-85217aac886b', 63709.20, NOW() - INTERVAL '15 days'),
  ('fa3e0e2f-71ba-4820-a528-7be1dfabcd52', '1a868c2d-e8aa-4670-8964-85217aac886b', 58990, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('f5a21576-d54e-4c30-ba2b-203eef4da56a', '1a868c2d-e8aa-4670-8964-85217aac886b', 'Verified Customer', 4.3, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('db509787-f84b-4a3d-963e-0ca0b3e644b3', '289a400d-ed31-44db-babc-57dab4816907', 'Flipkart', 'https://www.flipkart.com/search?q=hp+pavilion+15', 59990, 'INR', 4.3, 3100, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('1f066094-e496-46a8-92cf-f51d4043a8fe', 'db509787-f84b-4a3d-963e-0ca0b3e644b3', 64789.20, NOW() - INTERVAL '15 days'),
  ('682b9336-86d9-4ccc-9ad5-9c27f3a1af3b', 'db509787-f84b-4a3d-963e-0ca0b3e644b3', 59990, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('41c75418-29cd-4480-82fc-911f1d3d21e8', 'db509787-f84b-4a3d-963e-0ca0b3e644b3', 'Verified Customer', 4.3, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('250aa4bc-726c-45a6-ad5c-efd8f4d9b16f', '289a400d-ed31-44db-babc-57dab4816907', 'Croma', 'https://www.croma.com/searchB?q=hp+pavilion+15', 62490, 'INR', 4.3, 520, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('41bcb3f9-fc91-4dce-97d8-bed7c364d11c', '250aa4bc-726c-45a6-ad5c-efd8f4d9b16f', 67489.20, NOW() - INTERVAL '15 days'),
  ('1b45fe5d-fef2-4310-92d3-2f66657ef1c7', '250aa4bc-726c-45a6-ad5c-efd8f4d9b16f', 62490, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('0385c1cb-1bfa-4f11-9710-5b8d9361d9a4', '250aa4bc-726c-45a6-ad5c-efd8f4d9b16f', 'Verified Customer', 4.3, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('bb23882b-e1aa-40ab-a312-e81fc880e5c3', '289a400d-ed31-44db-babc-57dab4816907', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹58,990', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 58990, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹3,500.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('14dc503f-3b8c-4f8a-83e7-448867b1c5d6', 'Lenovo Legion 5 Pro Gaming Laptop (Ryzen 7 7745HX, 16GB RAM, RTX 4060 8GB)', 'Computers', 'Lenovo', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600', '16-inch WQXGA 240Hz 500 nits IPS Display, NVIDIA GeForce RTX 4060 8GB GDDR6, Coldfront 5.0 Thermal Tech.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('543f5bbd-1e23-4e77-90f9-c1da1c42262e', '14dc503f-3b8c-4f8a-83e7-448867b1c5d6', 'Amazon', 'https://www.amazon.in/s?k=lenovo+legion+5+pro', 124990, 'INR', 4.6, 1800, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('fd245bd1-c35c-4614-8011-b02aeeddc0df', '543f5bbd-1e23-4e77-90f9-c1da1c42262e', 134989.20, NOW() - INTERVAL '15 days'),
  ('be9402c6-aeaa-46ae-b198-31194381225d', '543f5bbd-1e23-4e77-90f9-c1da1c42262e', 124990, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('225744eb-aebd-4b11-abfe-a5d75e1acfd2', '543f5bbd-1e23-4e77-90f9-c1da1c42262e', 'Verified Customer', 4.6, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('ae258764-2bce-48e7-a860-b2013a152c85', '14dc503f-3b8c-4f8a-83e7-448867b1c5d6', 'Flipkart', 'https://www.flipkart.com/search?q=lenovo+legion+5+pro', 126990, 'INR', 4.6, 1200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('af830f0e-6300-4c0e-ada3-72630c6a8780', 'ae258764-2bce-48e7-a860-b2013a152c85', 137149.20, NOW() - INTERVAL '15 days'),
  ('c08f538a-6009-41b6-8b6f-38cc0123c9b7', 'ae258764-2bce-48e7-a860-b2013a152c85', 126990, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('17664486-1660-4e96-b141-025f4f1a97e2', 'ae258764-2bce-48e7-a860-b2013a152c85', 'Verified Customer', 4.6, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('c966fc88-c2c4-4972-bf02-36ea7b9df6e0', '14dc503f-3b8c-4f8a-83e7-448867b1c5d6', 'Croma', 'https://www.croma.com/searchB?q=lenovo+legion+5+pro', 129990, 'INR', 4.5, 310, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('95c648bc-c214-4d10-8692-dcbd486f9cdc', 'c966fc88-c2c4-4972-bf02-36ea7b9df6e0', 140389.20, NOW() - INTERVAL '15 days'),
  ('d99c862c-28d5-498b-b3f1-7d6708a6393c', 'c966fc88-c2c4-4972-bf02-36ea7b9df6e0', 129990, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('0fd20e94-11d9-40fd-90e7-eba169b895f7', 'c966fc88-c2c4-4972-bf02-36ea7b9df6e0', 'Verified Customer', 4.5, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('4c08a75a-284c-4da2-99b7-44b34473c40e', '14dc503f-3b8c-4f8a-83e7-448867b1c5d6', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹1,24,990', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 124990, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹5,000.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('9ed7ea08-d4b1-4682-8e5e-2d728132e8dd', 'Dell XPS 13 Plus 9320 Laptop (13.4" OLED 3.5K, Intel Core i7 13th Gen, 16GB/1TB)', 'Computers', 'Dell', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600', 'Zero-lattice keyboard, seamless glass haptic touchpad, capacitive touch function row, Intel Evo certified.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('df3189d9-4566-445c-9ad5-6bd16c1eb94f', '9ed7ea08-d4b1-4682-8e5e-2d728132e8dd', 'Flipkart', 'https://www.flipkart.com/search?q=dell+xps+13+plus', 143990, 'INR', 4.5, 620, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('2965f71e-5040-4a5d-8d7d-b959a5f04db8', 'df3189d9-4566-445c-9ad5-6bd16c1eb94f', 155509.20, NOW() - INTERVAL '15 days'),
  ('ae9ba21e-ad81-4217-9fe9-a91f0c6e8359', 'df3189d9-4566-445c-9ad5-6bd16c1eb94f', 143990, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('806b0ef3-2cb4-4579-953c-955f160fb4fb', 'df3189d9-4566-445c-9ad5-6bd16c1eb94f', 'Verified Customer', 4.5, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('256da870-f3da-4382-8d74-f1c507fb9bf2', '9ed7ea08-d4b1-4682-8e5e-2d728132e8dd', 'Amazon', 'https://www.amazon.in/s?k=dell+xps+13+plus', 146870, 'INR', 4.5, 940, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('0d0b4a64-7a7d-43f8-b0d4-31b728dad84c', '256da870-f3da-4382-8d74-f1c507fb9bf2', 158619.60, NOW() - INTERVAL '15 days'),
  ('da7e51df-82e2-47b0-ae8f-69dd9b5cc20a', '256da870-f3da-4382-8d74-f1c507fb9bf2', 146870, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('3a0e3f41-c4e1-4b5d-a2d2-73fa177aeab5', '256da870-f3da-4382-8d74-f1c507fb9bf2', 'Verified Customer', 4.5, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('a23147cd-81ff-40dd-a6b3-a64d362eb730', '9ed7ea08-d4b1-4682-8e5e-2d728132e8dd', 'Croma', 'https://www.croma.com/searchB?q=dell+xps+13+plus', 152990, 'INR', 4.4, 210, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('2658c69f-f381-4651-af2b-b17b9edc9e7c', 'a23147cd-81ff-40dd-a6b3-a64d362eb730', 165229.20, NOW() - INTERVAL '15 days'),
  ('b441e171-7eba-49c3-9604-9faef85e0b08', 'a23147cd-81ff-40dd-a6b3-a64d362eb730', 152990, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('9889fa5f-2603-40cc-ab55-3014c92fb702', 'a23147cd-81ff-40dd-a6b3-a64d362eb730', 'Verified Customer', 4.4, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('56ecc0f6-dbd7-4385-9d15-df8dafd9a3fc', '9ed7ea08-d4b1-4682-8e5e-2d728132e8dd', 'Flipkart', 95, ARRAY['Lowest authenticated price verified at ₹1,43,990', 'Guaranteed genuine warranty & authorized seller fulfillment on Flipkart', 'Fast express dispatch with 7-day hassle-free replacement'], 143990, 'Flipkart', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Flipkart for maximum savings of ₹9,000.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('5eb0ef10-9b90-451a-affb-2ae804d2c4e7', 'Apple Watch Series 9 GPS (45mm Midnight Aluminium)', 'Wearables', 'Apple', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600', 'S9 SiP chip with Double Tap gesture, Blood Oxygen app, ECG, Crash Detection, brighter always-on display.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('a50d0dab-e75d-4556-b41d-172e6466dc5d', '5eb0ef10-9b90-451a-affb-2ae804d2c4e7', 'Flipkart', 'https://www.flipkart.com/search?q=apple+watch+series+9', 37490, 'INR', 4.7, 4200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('d33fe150-5f84-478c-b079-8d4adf7662b0', 'a50d0dab-e75d-4556-b41d-172e6466dc5d', 40489.20, NOW() - INTERVAL '15 days'),
  ('ad055ef1-ea0a-41dc-bda8-51f74cbe78c3', 'a50d0dab-e75d-4556-b41d-172e6466dc5d', 37490, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('18473869-84fe-44a4-9a90-8f9f83636716', 'a50d0dab-e75d-4556-b41d-172e6466dc5d', 'Verified Customer', 4.7, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('6e474f51-161b-4683-9db4-9e226bfb929b', '5eb0ef10-9b90-451a-affb-2ae804d2c4e7', 'Amazon', 'https://www.amazon.in/s?k=apple+watch+series+9', 37990, 'INR', 4.7, 6500, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('48a7976f-49cb-4ed3-b962-6ad8e022e04e', '6e474f51-161b-4683-9db4-9e226bfb929b', 41029.20, NOW() - INTERVAL '15 days'),
  ('483dd895-0dbc-4c45-a246-78e2c4c83895', '6e474f51-161b-4683-9db4-9e226bfb929b', 37990, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('decfda7b-5947-43c4-b153-fd447d30811b', '6e474f51-161b-4683-9db4-9e226bfb929b', 'Verified Customer', 4.7, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('63ec0710-c52c-428c-b4fb-37cb379f4d88', '5eb0ef10-9b90-451a-affb-2ae804d2c4e7', 'Croma', 'https://www.croma.com/searchB?q=apple+watch+series+9', 39900, 'INR', 4.6, 890, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('1cc7c938-3726-4b06-9ebc-86cd91ad2e5f', '63ec0710-c52c-428c-b4fb-37cb379f4d88', 43092.00, NOW() - INTERVAL '15 days'),
  ('5a22e080-7c5b-47d6-ba11-56801583fcd9', '63ec0710-c52c-428c-b4fb-37cb379f4d88', 39900, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('e270b22b-ad3e-433f-a375-c5bbed7a53e0', '63ec0710-c52c-428c-b4fb-37cb379f4d88', 'Verified Customer', 4.6, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('6dd66ada-7480-4306-a935-5daf99ac9bcc', '5eb0ef10-9b90-451a-affb-2ae804d2c4e7', 'Flipkart', 95, ARRAY['Lowest authenticated price verified at ₹37,490', 'Guaranteed genuine warranty & authorized seller fulfillment on Flipkart', 'Fast express dispatch with 7-day hassle-free replacement'], 37490, 'Flipkart', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Flipkart for maximum savings of ₹2,410.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('c0f4da3a-7bc8-4386-831c-a7cdb896b9e3', 'Samsung Galaxy Watch 6 Bluetooth (44mm Graphite)', 'Wearables', 'Samsung', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600', 'Personalized heart rate zones, advanced sleep coaching, sapphire crystal glass, 20% larger display.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('0a253a83-24bd-4929-9f35-336da2235e64', 'c0f4da3a-7bc8-4386-831c-a7cdb896b9e3', 'Amazon', 'https://www.amazon.in/s?k=galaxy+watch+6', 18999, 'INR', 4.5, 3800, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('59ac9d2a-d7da-4c7c-8233-81a06da7d3bb', '0a253a83-24bd-4929-9f35-336da2235e64', 20518.92, NOW() - INTERVAL '15 days'),
  ('092c8ea7-9ed4-4810-9dfd-c3b2901964c7', '0a253a83-24bd-4929-9f35-336da2235e64', 18999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('6547020c-9893-415d-ae25-dd9c27351714', '0a253a83-24bd-4929-9f35-336da2235e64', 'Verified Customer', 4.5, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('c6c384e3-ac56-4c0e-8523-4fc50ad5ce6c', 'c0f4da3a-7bc8-4386-831c-a7cdb896b9e3', 'Flipkart', 'https://www.flipkart.com/search?q=galaxy+watch+6', 19499, 'INR', 4.5, 2400, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('22e77221-20ff-429f-84b7-1695f87db7eb', 'c6c384e3-ac56-4c0e-8523-4fc50ad5ce6c', 21058.92, NOW() - INTERVAL '15 days'),
  ('335003e7-495f-4748-afc4-4aea22bad909', 'c6c384e3-ac56-4c0e-8523-4fc50ad5ce6c', 19499, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('8d36bff5-e5f2-4f9e-872c-5203c1de739f', 'c6c384e3-ac56-4c0e-8523-4fc50ad5ce6c', 'Verified Customer', 4.5, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('7bdd8aa3-ad24-4fbd-9e70-dfcc4c4cf302', 'c0f4da3a-7bc8-4386-831c-a7cdb896b9e3', 'Croma', 'https://www.croma.com/searchB?q=galaxy+watch+6', 21999, 'INR', 4.4, 510, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('bc02e216-3335-41c3-ae8e-cc2151f995d9', '7bdd8aa3-ad24-4fbd-9e70-dfcc4c4cf302', 23758.92, NOW() - INTERVAL '15 days'),
  ('c3b0bdbf-2606-439b-8982-c430cae47adb', '7bdd8aa3-ad24-4fbd-9e70-dfcc4c4cf302', 21999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('d1b56a80-a00a-487e-81d3-6ba510c98d39', '7bdd8aa3-ad24-4fbd-9e70-dfcc4c4cf302', 'Verified Customer', 4.4, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('5464090f-9a84-429b-a8ab-7decc3ddfd7d', 'c0f4da3a-7bc8-4386-831c-a7cdb896b9e3', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹18,999', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 18999, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹3,000.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('b6d15ad8-8ce5-44f6-b8ad-4d8f9a7c65b1', 'Levi''s Men''s 511 Slim Fit Stretchable Denim Jeans', 'Fashion', 'Levi''s', 'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=600', 'Classic 5-pocket styling with added stretch for all-day mobility and modern slim profile.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('f2e8eab2-d66e-490f-9ddd-d662b05dc104', 'b6d15ad8-8ce5-44f6-b8ad-4d8f9a7c65b1', 'Meesho', 'https://www.meesho.com/search?q=levis+511+jeans', 1549, 'INR', 4.3, 2400, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('15c26f93-0259-48bd-8aed-e358cc11f4b7', 'f2e8eab2-d66e-490f-9ddd-d662b05dc104', 1672.92, NOW() - INTERVAL '15 days'),
  ('8b387d2c-0b0f-4264-b4c7-d13b33c5638d', 'f2e8eab2-d66e-490f-9ddd-d662b05dc104', 1549, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('5702f4cb-75c9-42b7-acb9-1f08b4246432', 'f2e8eab2-d66e-490f-9ddd-d662b05dc104', 'Verified Customer', 4.3, 'Excellent verified authentic product from Meesho with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('02fe20bf-1a13-440f-957f-d0938d3945f1', 'b6d15ad8-8ce5-44f6-b8ad-4d8f9a7c65b1', 'Myntra', 'https://www.myntra.com/levis-511-jeans', 1699, 'INR', 4.5, 18200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('49e9056c-f067-4b26-8b21-fbafabb13b09', '02fe20bf-1a13-440f-957f-d0938d3945f1', 1834.92, NOW() - INTERVAL '15 days'),
  ('c80a29f3-5d5b-401e-9daf-57a1d6dd79d0', '02fe20bf-1a13-440f-957f-d0938d3945f1', 1699, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('e9a7d94d-7fb4-4425-a38a-0ed4096b127c', '02fe20bf-1a13-440f-957f-d0938d3945f1', 'Verified Customer', 4.5, 'Excellent verified authentic product from Myntra with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('54fac3f5-1a8a-4646-ba67-b833f0631556', 'b6d15ad8-8ce5-44f6-b8ad-4d8f9a7c65b1', 'Flipkart', 'https://www.flipkart.com/search?q=levis+511+jeans', 1729, 'INR', 4.4, 9400, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('9071d57f-330c-48c5-b3ee-fcd9ca3ae889', '54fac3f5-1a8a-4646-ba67-b833f0631556', 1867.32, NOW() - INTERVAL '15 days'),
  ('e3830cc3-d352-4f48-95c3-614fa2c9dfac', '54fac3f5-1a8a-4646-ba67-b833f0631556', 1729, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('e9ce29c4-3454-4d2b-bb27-f2191858e44a', '54fac3f5-1a8a-4646-ba67-b833f0631556', 'Verified Customer', 4.4, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('55e4466b-b178-4a3c-9956-426bc2a1438b', 'b6d15ad8-8ce5-44f6-b8ad-4d8f9a7c65b1', 'Amazon', 'https://www.amazon.in/s?k=levis+511+jeans', 1799, 'INR', 4.4, 12500, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('00091432-afca-4ff1-a263-584ea9a4f358', '55e4466b-b178-4a3c-9956-426bc2a1438b', 1942.92, NOW() - INTERVAL '15 days'),
  ('795ccfea-827e-44f3-9d6f-0b654c3742f9', '55e4466b-b178-4a3c-9956-426bc2a1438b', 1799, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('4655026d-009f-4185-b6c3-082bbae742af', '55e4466b-b178-4a3c-9956-426bc2a1438b', 'Verified Customer', 4.4, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('21a24637-d83e-463b-9dc1-40cdc4d1e5fb', 'b6d15ad8-8ce5-44f6-b8ad-4d8f9a7c65b1', 'Meesho', 95, ARRAY['Lowest authenticated price verified at ₹1,549', 'Guaranteed genuine warranty & authorized seller fulfillment on Meesho', 'Fast express dispatch with 7-day hassle-free replacement'], 1549, 'Meesho', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Meesho for maximum savings of ₹250.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('3725b564-6d2e-4967-8f98-7c12b3ddd51d', 'Womans Rayon Kurti With Palazzo (Embroidered Set)', 'Fashion', 'GoSriKi', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600', 'Straight Rayon Kurta with matching Palazzo set, detailed embroidery on neckline, breathable festive wear.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('b1c8e08f-9817-42bb-8669-1e7d8320a3f0', '3725b564-6d2e-4967-8f98-7c12b3ddd51d', 'Meesho', 'https://www.meesho.com/search?q=rayon+kurti+palazzo', 449, 'INR', 4.2, 14200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('f832818c-15fb-417a-bead-d3eeed549a42', 'b1c8e08f-9817-42bb-8669-1e7d8320a3f0', 484.92, NOW() - INTERVAL '15 days'),
  ('c576bd22-0a25-428f-98d1-839bf54c5bf9', 'b1c8e08f-9817-42bb-8669-1e7d8320a3f0', 449, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('07e59c82-1fd1-4166-a6e6-e2269a371b53', 'b1c8e08f-9817-42bb-8669-1e7d8320a3f0', 'Verified Customer', 4.2, 'Excellent verified authentic product from Meesho with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('3442aa03-55d9-47ec-beca-eb0731f8495f', '3725b564-6d2e-4967-8f98-7c12b3ddd51d', 'Flipkart', 'https://www.flipkart.com/search?q=rayon+kurti+palazzo', 599, 'INR', 4.3, 8900, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('6a71bc6e-b5f3-4af2-b149-bf53d11eef59', '3442aa03-55d9-47ec-beca-eb0731f8495f', 646.92, NOW() - INTERVAL '15 days'),
  ('46cd371b-5121-4ee1-a0e7-8108c5f1df56', '3442aa03-55d9-47ec-beca-eb0731f8495f', 599, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('acbb55a0-236c-4053-a1f1-210f4438eb30', '3442aa03-55d9-47ec-beca-eb0731f8495f', 'Verified Customer', 4.3, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('443ce680-c2e0-405d-bfb6-2e6d8aec1c92', '3725b564-6d2e-4967-8f98-7c12b3ddd51d', 'Myntra', 'https://www.myntra.com/rayon-kurti-palazzo', 699, 'INR', 4.4, 5600, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('397fc62d-f0f7-4ac7-849b-671c9740d81b', '443ce680-c2e0-405d-bfb6-2e6d8aec1c92', 754.92, NOW() - INTERVAL '15 days'),
  ('ab44d505-564a-43ea-8921-a9efe7bcbab2', '443ce680-c2e0-405d-bfb6-2e6d8aec1c92', 699, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('9973d516-fe9a-4962-bbb1-83f07350490b', '443ce680-c2e0-405d-bfb6-2e6d8aec1c92', 'Verified Customer', 4.4, 'Excellent verified authentic product from Myntra with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('8f8aa3f2-ebf8-4050-a75c-0af8425893ea', '3725b564-6d2e-4967-8f98-7c12b3ddd51d', 'Amazon', 'https://www.amazon.in/s?k=rayon+kurti+palazzo', 749, 'INR', 4.2, 4200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('e6f01efe-e2ec-416e-824f-9d0599d419de', '8f8aa3f2-ebf8-4050-a75c-0af8425893ea', 808.92, NOW() - INTERVAL '15 days'),
  ('bf79db26-1724-410d-b616-443d35c7dbe3', '8f8aa3f2-ebf8-4050-a75c-0af8425893ea', 749, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('0c6413f1-20c2-4fd0-89d6-3a9e80575735', '8f8aa3f2-ebf8-4050-a75c-0af8425893ea', 'Verified Customer', 4.2, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('adaa3230-7611-4874-8686-a03485597b26', '3725b564-6d2e-4967-8f98-7c12b3ddd51d', 'Meesho', 95, ARRAY['Lowest authenticated price verified at ₹449', 'Guaranteed genuine warranty & authorized seller fulfillment on Meesho', 'Fast express dispatch with 7-day hassle-free replacement'], 449, 'Meesho', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Meesho for maximum savings of ₹300.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('727a18d0-3818-4ea7-89a7-e5b69f1c5cbd', 'Puma Classic Unisex Fleece Pullover Hoodie', 'Fashion', 'Puma', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600', 'Soft brushed fleece lining, kangaroo front pocket, ribbed cuffs and hem with prominent Puma cat logo.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('c41a4392-c3f0-408e-a1d2-de0ad118e69c', '727a18d0-3818-4ea7-89a7-e5b69f1c5cbd', 'Meesho', 'https://www.meesho.com/search?q=puma+hoodie', 829, 'INR', 4.1, 1800, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('670ae0f3-1628-471c-bfa2-51b7efbaa3e5', 'c41a4392-c3f0-408e-a1d2-de0ad118e69c', 895.32, NOW() - INTERVAL '15 days'),
  ('bbb15aa8-4378-49cf-a417-6f264440bb1c', 'c41a4392-c3f0-408e-a1d2-de0ad118e69c', 829, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('9dcd1351-d242-41d9-8dce-3f48300e58a4', 'c41a4392-c3f0-408e-a1d2-de0ad118e69c', 'Verified Customer', 4.1, 'Excellent verified authentic product from Meesho with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('db5771a9-6e35-47be-a00b-9698543e54c9', '727a18d0-3818-4ea7-89a7-e5b69f1c5cbd', 'Flipkart', 'https://www.flipkart.com/search?q=puma+hoodie', 899, 'INR', 4.3, 6500, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('677e0aa8-8c05-4286-80bf-d6caeea768e0', 'db5771a9-6e35-47be-a00b-9698543e54c9', 970.92, NOW() - INTERVAL '15 days'),
  ('03fecc29-6c50-42cb-b559-0cd8637ca01f', 'db5771a9-6e35-47be-a00b-9698543e54c9', 899, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('6c9e092a-417f-43ee-9944-9104b69a927e', 'db5771a9-6e35-47be-a00b-9698543e54c9', 'Verified Customer', 4.3, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('9c1ba18a-7f18-4b04-b3eb-ea9839941b41', '727a18d0-3818-4ea7-89a7-e5b69f1c5cbd', 'Amazon', 'https://www.amazon.in/s?k=puma+hoodie', 949, 'INR', 4.4, 7800, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('0b16ecf1-be30-4c90-aa29-bef9831e48d6', '9c1ba18a-7f18-4b04-b3eb-ea9839941b41', 1024.92, NOW() - INTERVAL '15 days'),
  ('066251c5-3de2-4d7b-8799-3bcc80fa866e', '9c1ba18a-7f18-4b04-b3eb-ea9839941b41', 949, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('b9385e77-5d14-402e-8216-ec0a374cf79c', '9c1ba18a-7f18-4b04-b3eb-ea9839941b41', 'Verified Customer', 4.4, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('2157ad2f-9fd2-4fd7-990c-e169e56bffe9', '727a18d0-3818-4ea7-89a7-e5b69f1c5cbd', 'Myntra', 'https://www.myntra.com/puma-hoodie', 999, 'INR', 4.5, 11200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('75f11933-d026-41f6-93d4-305b69d8e62c', '2157ad2f-9fd2-4fd7-990c-e169e56bffe9', 1078.92, NOW() - INTERVAL '15 days'),
  ('88f35309-6df9-437b-a22e-da3c86fd9387', '2157ad2f-9fd2-4fd7-990c-e169e56bffe9', 999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('3ec42b0b-c7e7-4b39-8e22-e4e1c4ed727b', '2157ad2f-9fd2-4fd7-990c-e169e56bffe9', 'Verified Customer', 4.5, 'Excellent verified authentic product from Myntra with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('cf84d13c-e77a-4e01-afc3-7aef049e054b', '727a18d0-3818-4ea7-89a7-e5b69f1c5cbd', 'Meesho', 95, ARRAY['Lowest authenticated price verified at ₹829', 'Guaranteed genuine warranty & authorized seller fulfillment on Meesho', 'Fast express dispatch with 7-day hassle-free replacement'], 829, 'Meesho', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Meesho for maximum savings of ₹170.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('9e630b5b-7722-4eab-b440-1b1c9afc0bdd', 'Ray-Ban Aviator Classic Polarized Sunglasses (Gold Frame)', 'Fashion', 'Ray-Ban', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600', 'Iconic teardrop shape, polarized green classic G-15 lenses, 100% UV protection with metal frame.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('3867c171-87cc-4559-ab21-d05d8e35f6af', '9e630b5b-7722-4eab-b440-1b1c9afc0bdd', 'Amazon', 'https://www.amazon.in/s?k=rayban+aviator+polarized', 6490, 'INR', 4.6, 3800, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('489c562c-1edb-4f75-b1b3-c6f4ea8c01d0', '3867c171-87cc-4559-ab21-d05d8e35f6af', 7009.20, NOW() - INTERVAL '15 days'),
  ('be030b06-5bf4-4874-93ac-7c93af6cbece', '3867c171-87cc-4559-ab21-d05d8e35f6af', 6490, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('c50dc07f-cfc0-45aa-9054-5ad39d776082', '3867c171-87cc-4559-ab21-d05d8e35f6af', 'Verified Customer', 4.6, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('54a56bec-bc64-4d23-8a34-bd0a82c3a84f', '9e630b5b-7722-4eab-b440-1b1c9afc0bdd', 'Flipkart', 'https://www.flipkart.com/search?q=rayban+aviator+polarized', 6690, 'INR', 4.5, 2100, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('d5db9fc7-948f-4e34-99e1-92ae440a9728', '54a56bec-bc64-4d23-8a34-bd0a82c3a84f', 7225.20, NOW() - INTERVAL '15 days'),
  ('6bd427f9-1059-4ee3-8c1f-9c7a29928161', '54a56bec-bc64-4d23-8a34-bd0a82c3a84f', 6690, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('d924948c-5eb8-4234-9b3a-081ce927a3de', '54a56bec-bc64-4d23-8a34-bd0a82c3a84f', 'Verified Customer', 4.5, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('32db7eb0-1705-4079-9092-0e5bc4cb0f65', '9e630b5b-7722-4eab-b440-1b1c9afc0bdd', 'Myntra', 'https://www.myntra.com/rayban-aviator-polarized', 6990, 'INR', 4.6, 4500, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('dc611bce-523e-4064-88ec-2446e6bcfbdd', '32db7eb0-1705-4079-9092-0e5bc4cb0f65', 7549.20, NOW() - INTERVAL '15 days'),
  ('26026cb3-fd8c-4cb7-a062-676a7b0c5f5a', '32db7eb0-1705-4079-9092-0e5bc4cb0f65', 6990, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('e2cd3817-684b-4968-b73a-31fa3ec2f50d', '32db7eb0-1705-4079-9092-0e5bc4cb0f65', 'Verified Customer', 4.6, 'Excellent verified authentic product from Myntra with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('ee74746d-4495-4a7a-b3a9-79a6f772ae17', '9e630b5b-7722-4eab-b440-1b1c9afc0bdd', 'Croma', 'https://www.croma.com/searchB?q=rayban+aviator', 7490, 'INR', 4.3, 120, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('db897c56-ee1e-44ad-b049-c2404ae3e15d', 'ee74746d-4495-4a7a-b3a9-79a6f772ae17', 8089.20, NOW() - INTERVAL '15 days'),
  ('ed29a415-9cee-4909-8be5-93eb0bdcba6d', 'ee74746d-4495-4a7a-b3a9-79a6f772ae17', 7490, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('5eca4222-e99e-402b-a98c-c0eb252b4504', 'ee74746d-4495-4a7a-b3a9-79a6f772ae17', 'Verified Customer', 4.3, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('0f8c18dd-d427-4d8c-b412-118fcae47970', '9e630b5b-7722-4eab-b440-1b1c9afc0bdd', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹6,490', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 6490, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹1,000.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('14dc6100-07f8-4ad0-a418-cc88939df564', 'Nike Air Zoom Pegasus 40 Road Running Shoes', 'Footwear', 'Nike', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600', 'Nike React foam with dual Zoom Air units for responsive bounce, engineered mesh upper for lightweight breathability.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('a86ccc6d-b7d9-49c5-8e62-9353fbdcaad5', '14dc6100-07f8-4ad0-a418-cc88939df564', 'Nike', 'https://www.nike.com/in/t/air-zoom-pegasus-40', 8495, 'INR', 4.8, 3200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('b6a58527-de0c-4ebc-b445-301b70a8ab31', 'a86ccc6d-b7d9-49c5-8e62-9353fbdcaad5', 9174.60, NOW() - INTERVAL '15 days'),
  ('4876f820-96f4-4502-8a18-8b1b42300a27', 'a86ccc6d-b7d9-49c5-8e62-9353fbdcaad5', 8495, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('cb5b8a07-7f67-4e95-a0f1-dde038cd1906', 'a86ccc6d-b7d9-49c5-8e62-9353fbdcaad5', 'Verified Customer', 4.8, 'Excellent verified authentic product from Nike with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('9f54bc0d-7911-4838-902b-e5cd5409055f', '14dc6100-07f8-4ad0-a418-cc88939df564', 'Myntra', 'https://www.myntra.com/nike-pegasus-40', 7645, 'INR', 4.7, 5800, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('6ebee650-35fd-4ec5-b604-a222b65bde6c', '9f54bc0d-7911-4838-902b-e5cd5409055f', 8256.60, NOW() - INTERVAL '15 days'),
  ('42a6b987-08f5-47b8-8485-077b183e1fca', '9f54bc0d-7911-4838-902b-e5cd5409055f', 7645, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('47af27a0-e31d-49dd-ba04-eafdaefe5482', '9f54bc0d-7911-4838-902b-e5cd5409055f', 'Verified Customer', 4.7, 'Excellent verified authentic product from Myntra with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('1249016f-6f95-489b-b6ae-8265ab200b86', '14dc6100-07f8-4ad0-a418-cc88939df564', 'Flipkart', 'https://www.flipkart.com/search?q=nike+pegasus+40', 7899, 'INR', 4.6, 2900, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('68e35346-03be-4219-a322-6f00f28a9b39', '1249016f-6f95-489b-b6ae-8265ab200b86', 8530.92, NOW() - INTERVAL '15 days'),
  ('0122dd96-6ad0-45ba-8fbe-34c1a54c8244', '1249016f-6f95-489b-b6ae-8265ab200b86', 7899, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('c5d6b521-28f6-4c1f-8fe6-faa22f141d6b', '1249016f-6f95-489b-b6ae-8265ab200b86', 'Verified Customer', 4.6, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('df7fe113-2fcf-4ef1-8f05-1184cb8718fa', '14dc6100-07f8-4ad0-a418-cc88939df564', 'Amazon', 'https://www.amazon.in/s?k=nike+pegasus+40', 7999, 'INR', 4.6, 4100, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('70e1311c-0e39-48f6-b936-f00244c9ef93', 'df7fe113-2fcf-4ef1-8f05-1184cb8718fa', 8638.92, NOW() - INTERVAL '15 days'),
  ('843bce8c-75e8-4118-a407-9fa320fe7dda', 'df7fe113-2fcf-4ef1-8f05-1184cb8718fa', 7999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('879e0aeb-7cf8-41eb-879b-31c78136a0a9', 'df7fe113-2fcf-4ef1-8f05-1184cb8718fa', 'Verified Customer', 4.6, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('5eb5f04e-538f-466c-8e60-9a00c134e07b', '14dc6100-07f8-4ad0-a418-cc88939df564', 'Myntra', 95, ARRAY['Lowest authenticated price verified at ₹7,645', 'Guaranteed genuine warranty & authorized seller fulfillment on Myntra', 'Fast express dispatch with 7-day hassle-free replacement'], 7645, 'Myntra', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Myntra for maximum savings of ₹850.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('7dd024f1-6f5d-4db6-814a-0b83faf094a1', 'Adidas Ultraboost Light Performance Running Shoes', 'Footwear', 'Adidas', 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=600', '30% lighter Light BOOST material, Continental Rubber outsole for superior grip, PRIMEKNIT+ textile upper.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('3b9e03ad-b29d-40fe-b0da-2e0b5f45dc7b', '7dd024f1-6f5d-4db6-814a-0b83faf094a1', 'Amazon', 'https://www.amazon.in/s?k=adidas+ultraboost+light', 8999, 'INR', 4.6, 3100, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('f22c1aa4-1dc9-4d5a-a5d7-505770a2c080', '3b9e03ad-b29d-40fe-b0da-2e0b5f45dc7b', 9718.92, NOW() - INTERVAL '15 days'),
  ('01ed3c37-0811-4a08-9c30-c0d42d415a3d', '3b9e03ad-b29d-40fe-b0da-2e0b5f45dc7b', 8999, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('40b96577-fbb9-4d10-847a-60dac842cb4b', '3b9e03ad-b29d-40fe-b0da-2e0b5f45dc7b', 'Verified Customer', 4.6, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('0ad2517d-7171-4760-b22f-9ee3f72ba4a0', '7dd024f1-6f5d-4db6-814a-0b83faf094a1', 'Flipkart', 'https://www.flipkart.com/search?q=adidas+ultraboost+light', 9299, 'INR', 4.5, 2200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('18f42d2a-0a33-4c14-a8af-9f01ee56587f', '0ad2517d-7171-4760-b22f-9ee3f72ba4a0', 10042.92, NOW() - INTERVAL '15 days'),
  ('c83692e2-3afb-407a-96b2-d0bad7a87730', '0ad2517d-7171-4760-b22f-9ee3f72ba4a0', 9299, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('84861347-10c2-467a-9d36-678846d190c8', '0ad2517d-7171-4760-b22f-9ee3f72ba4a0', 'Verified Customer', 4.5, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('da7c1aef-6725-4ef0-984c-aafd175b444d', '7dd024f1-6f5d-4db6-814a-0b83faf094a1', 'Myntra', 'https://www.myntra.com/adidas-ultraboost-light', 9499, 'INR', 4.6, 4900, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('e705898e-21dd-4505-9549-8d91bf20a2d1', 'da7c1aef-6725-4ef0-984c-aafd175b444d', 10258.92, NOW() - INTERVAL '15 days'),
  ('2b6ee8bb-06c8-4d13-bce4-ae5171a63448', 'da7c1aef-6725-4ef0-984c-aafd175b444d', 9499, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('541293c3-8d52-4eba-b173-fd1dbe2526b3', 'da7c1aef-6725-4ef0-984c-aafd175b444d', 'Verified Customer', 4.6, 'Excellent verified authentic product from Myntra with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('d76ccb55-9f69-4c9f-9360-8e5532e552a2', '7dd024f1-6f5d-4db6-814a-0b83faf094a1', 'Meesho', 'https://www.meesho.com/search?q=adidas+ultraboost+light', 9199, 'INR', 4.1, 40, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('381444be-58c1-4d98-a05e-1465217ed275', 'd76ccb55-9f69-4c9f-9360-8e5532e552a2', 9934.92, NOW() - INTERVAL '15 days'),
  ('c51c57be-f1db-452f-ab39-2ac7956500ff', 'd76ccb55-9f69-4c9f-9360-8e5532e552a2', 9199, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('4594e3fb-550c-48bf-ab86-6eff719a1f37', 'd76ccb55-9f69-4c9f-9360-8e5532e552a2', 'Verified Customer', 4.1, 'Excellent verified authentic product from Meesho with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('b2436655-a8ac-4474-a38f-7ece80e4a3c0', '7dd024f1-6f5d-4db6-814a-0b83faf094a1', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹8,999', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 8999, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹500.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('12200752-89e4-4c3c-9a19-e07e276f2c7c', 'Crocs Classic Unisex Clogs with Customizable Jibbitz', 'Footwear', 'Crocs', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=600', 'Iconic Croslite foam cushioning, pivoting heel straps, ventilation ports for breathability and water drainage.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('0550061d-78a8-4812-9163-ba882d331cdd', '12200752-89e4-4c3c-9a19-e07e276f2c7c', 'Meesho', 'https://www.meesho.com/search?q=crocs+classic+clogs', 1289, 'INR', 4.2, 3800, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('80df87c3-694e-48ac-93a0-0e02fb98dabe', '0550061d-78a8-4812-9163-ba882d331cdd', 1392.12, NOW() - INTERVAL '15 days'),
  ('5074d880-ccd9-49fa-8109-5c10972d9c17', '0550061d-78a8-4812-9163-ba882d331cdd', 1289, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('8207532c-d80c-4db9-8116-216c6e5f27d8', '0550061d-78a8-4812-9163-ba882d331cdd', 'Verified Customer', 4.2, 'Excellent verified authentic product from Meesho with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('9e46078b-82e9-4b57-82e4-ee9e1514062c', '12200752-89e4-4c3c-9a19-e07e276f2c7c', 'Flipkart', 'https://www.flipkart.com/search?q=crocs+classic+clogs', 1499, 'INR', 4.4, 18900, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('238241f3-0f47-4fe1-bac8-0480d02ad1ca', '9e46078b-82e9-4b57-82e4-ee9e1514062c', 1618.92, NOW() - INTERVAL '15 days'),
  ('f70500b3-963e-4723-8cf2-8610f876a307', '9e46078b-82e9-4b57-82e4-ee9e1514062c', 1499, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('6a212b3c-b605-42d3-af3d-94d6723bf2fa', '9e46078b-82e9-4b57-82e4-ee9e1514062c', 'Verified Customer', 4.4, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('0e487861-2946-4070-a2b2-bea74ad217eb', '12200752-89e4-4c3c-9a19-e07e276f2c7c', 'Amazon', 'https://www.amazon.in/s?k=crocs+classic+clogs', 1599, 'INR', 4.5, 28000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('9074e56e-bc26-4b36-bdd5-9bd482c316c9', '0e487861-2946-4070-a2b2-bea74ad217eb', 1726.92, NOW() - INTERVAL '15 days'),
  ('db9bcf76-1715-4bc0-b94b-862b40af45b0', '0e487861-2946-4070-a2b2-bea74ad217eb', 1599, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('e04d9cc3-f7b0-46e1-8e97-10005a658422', '0e487861-2946-4070-a2b2-bea74ad217eb', 'Verified Customer', 4.5, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('d4aa673e-7c74-4050-ac80-99efaa2d8c88', '12200752-89e4-4c3c-9a19-e07e276f2c7c', 'Myntra', 'https://www.myntra.com/crocs-classic-clogs', 1699, 'INR', 4.5, 14500, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('bbe2e626-1927-49d9-8a79-0de9f673896a', 'd4aa673e-7c74-4050-ac80-99efaa2d8c88', 1834.92, NOW() - INTERVAL '15 days'),
  ('a2174934-82b0-4efc-97ec-f04f5df80f06', 'd4aa673e-7c74-4050-ac80-99efaa2d8c88', 1699, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('a9ef1b36-04c1-423a-84fb-4ac4d85bf9d0', 'd4aa673e-7c74-4050-ac80-99efaa2d8c88', 'Verified Customer', 4.5, 'Excellent verified authentic product from Myntra with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('bdf8dd29-e81b-4251-9390-212beff1cbe5', '12200752-89e4-4c3c-9a19-e07e276f2c7c', 'Meesho', 95, ARRAY['Lowest authenticated price verified at ₹1,289', 'Guaranteed genuine warranty & authorized seller fulfillment on Meesho', 'Fast express dispatch with 7-day hassle-free replacement'], 1289, 'Meesho', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Meesho for maximum savings of ₹410.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('f8dc70dd-208f-4631-99b9-32d425183f74', 'Medimix Ayurvedic 18 Herbs Classic Bathing Soap (125g)', 'Personal Care', 'Medimix', 'https://images.unsplash.com/photo-1608248597359-0d12e9b8f2c3?q=80&w=600', 'Enriched with 18 essential herbs, dermatologically tested, protects against blemishes, body odor, and skin infections.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('f6665710-d0b9-47c1-bce1-5d50253fc32e', 'f8dc70dd-208f-4631-99b9-32d425183f74', 'Amazon', 'https://www.amazon.in/s?k=medimix+soap+125g', 35, 'INR', 4.5, 11200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('42b246b0-fc9e-4d7e-b758-ef1bd5395225', 'f6665710-d0b9-47c1-bce1-5d50253fc32e', 37.80, NOW() - INTERVAL '15 days'),
  ('9f877cb0-ee46-4ef6-8659-0ba61b6b830f', 'f6665710-d0b9-47c1-bce1-5d50253fc32e', 35, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('713f2695-1840-4dda-b464-29ec790bfa50', 'f6665710-d0b9-47c1-bce1-5d50253fc32e', 'Verified Customer', 4.5, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('bce4676b-d370-49d8-a266-733fb1860906', 'f8dc70dd-208f-4631-99b9-32d425183f74', 'Flipkart', 'https://www.flipkart.com/search?q=medimix+soap+125g', 38, 'INR', 4.4, 6500, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('8cc80a9f-c3d3-436d-8e0d-01520f0bde4f', 'bce4676b-d370-49d8-a266-733fb1860906', 41.04, NOW() - INTERVAL '15 days'),
  ('ffe30512-d4d9-447b-9b0b-866e64ba1f71', 'bce4676b-d370-49d8-a266-733fb1860906', 38, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('3f1b1969-70f4-4108-934b-baf6dcbca81b', 'bce4676b-d370-49d8-a266-733fb1860906', 'Verified Customer', 4.4, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('049d586b-8d20-4071-8fb6-31c619412562', 'f8dc70dd-208f-4631-99b9-32d425183f74', 'Meesho', 'https://www.meesho.com/search?q=medimix+soap+125g', 36, 'INR', 4.2, 1800, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('7fed49a5-533f-41e6-90ab-a8f3269e0bfa', '049d586b-8d20-4071-8fb6-31c619412562', 38.88, NOW() - INTERVAL '15 days'),
  ('a22c5683-60e5-44c4-868f-ae535d29ef17', '049d586b-8d20-4071-8fb6-31c619412562', 36, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('504a2e1f-7435-4b43-854a-ae0668f8d01b', '049d586b-8d20-4071-8fb6-31c619412562', 'Verified Customer', 4.2, 'Excellent verified authentic product from Meesho with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('06f24ee8-5125-4925-b1e8-1da1a4372f9c', 'f8dc70dd-208f-4631-99b9-32d425183f74', 'Bigbasket', 'https://www.bigbasket.com/ps/?q=medimix+soap+125g', 37, 'INR', 4.5, 3400, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('2f4bb790-6a70-478d-b325-e12b5833c229', '06f24ee8-5125-4925-b1e8-1da1a4372f9c', 39.96, NOW() - INTERVAL '15 days'),
  ('cc63041a-2976-438a-afc6-6aa56b24bb1e', '06f24ee8-5125-4925-b1e8-1da1a4372f9c', 37, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('5bd9ae39-a2fd-450f-96bf-9e6824f84edc', '06f24ee8-5125-4925-b1e8-1da1a4372f9c', 'Verified Customer', 4.5, 'Excellent verified authentic product from Bigbasket with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('97433fdf-703a-48c0-8f17-a95a4789888f', 'f8dc70dd-208f-4631-99b9-32d425183f74', 'Amazon', 95, ARRAY['Lowest authenticated price verified at ₹35', 'Guaranteed genuine warranty & authorized seller fulfillment on Amazon', 'Fast express dispatch with 7-day hassle-free replacement'], 35, 'Amazon', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Amazon for maximum savings of ₹3.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('e7584be8-f66b-4afa-9805-4efa4ff47efb', 'Santoor Sandal and Turmeric Bathing Soap (100g)', 'Personal Care', 'Santoor', 'https://images.unsplash.com/photo-1607006314175-92736b4fb664?q=80&w=600', 'Natural Sandalwood and Turmeric extract blend for radiant, youthful, and glowing skin.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('213ff29c-fa18-4d39-963e-cb471f074ad2', 'e7584be8-f66b-4afa-9805-4efa4ff47efb', 'Flipkart', 'https://www.flipkart.com/search?q=santoor+soap+100g', 34, 'INR', 4.4, 14500, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('82474abb-2a81-4fbb-91ee-d58f7d8069ea', '213ff29c-fa18-4d39-963e-cb471f074ad2', 36.72, NOW() - INTERVAL '15 days'),
  ('7958ad7f-3e0e-44c2-903e-8cfa0f4669d0', '213ff29c-fa18-4d39-963e-cb471f074ad2', 34, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('dde74815-b6e8-4b47-98f9-35c35e88d4f4', '213ff29c-fa18-4d39-963e-cb471f074ad2', 'Verified Customer', 4.4, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('d78ba475-ed9d-48c8-b925-ec5aa942b982', 'e7584be8-f66b-4afa-9805-4efa4ff47efb', 'Amazon', 'https://www.amazon.in/s?k=santoor+soap+100g', 36, 'INR', 4.4, 18200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('bfbef3ba-2f4a-4851-b5a1-ca72f71e097c', 'd78ba475-ed9d-48c8-b925-ec5aa942b982', 38.88, NOW() - INTERVAL '15 days'),
  ('bf6edce6-bf5c-4251-9082-30bf2ad10d68', 'd78ba475-ed9d-48c8-b925-ec5aa942b982', 36, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('1cda15b1-3988-4dc0-bd21-163a24923557', 'd78ba475-ed9d-48c8-b925-ec5aa942b982', 'Verified Customer', 4.4, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('70ab274e-b95c-472f-b141-9088bd10e3fc', 'e7584be8-f66b-4afa-9805-4efa4ff47efb', 'Meesho', 'https://www.meesho.com/search?q=santoor+soap+100g', 35, 'INR', 4.2, 2900, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('047092ed-c8e0-4ecb-b4c7-8db95ed5a4e7', '70ab274e-b95c-472f-b141-9088bd10e3fc', 37.80, NOW() - INTERVAL '15 days'),
  ('53cfe1a8-9ed2-48de-9dd4-dcc4e8e9af6f', '70ab274e-b95c-472f-b141-9088bd10e3fc', 35, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('b4fef52d-cb8e-4f9e-96fa-bcda33b1c6e0', '70ab274e-b95c-472f-b141-9088bd10e3fc', 'Verified Customer', 4.2, 'Excellent verified authentic product from Meesho with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('5a0a5ea1-6e81-4a4b-be3d-d385346ac2bf', 'e7584be8-f66b-4afa-9805-4efa4ff47efb', 'Bigbasket', 'https://www.bigbasket.com/ps/?q=santoor+soap+100g', 35, 'INR', 4.5, 5100, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('f051beef-72dd-4b07-a8a4-ae28cec4693c', '5a0a5ea1-6e81-4a4b-be3d-d385346ac2bf', 37.80, NOW() - INTERVAL '15 days'),
  ('0f12a28f-8670-4fb6-b2ee-bdfab714d23a', '5a0a5ea1-6e81-4a4b-be3d-d385346ac2bf', 35, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('995ca4f1-8226-4f92-8f7b-9925f2652d1d', '5a0a5ea1-6e81-4a4b-be3d-d385346ac2bf', 'Verified Customer', 4.5, 'Excellent verified authentic product from Bigbasket with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('310fbfe6-84dd-40b2-a9b8-d9e2dba73c53', 'e7584be8-f66b-4afa-9805-4efa4ff47efb', 'Flipkart', 95, ARRAY['Lowest authenticated price verified at ₹34', 'Guaranteed genuine warranty & authorized seller fulfillment on Flipkart', 'Fast express dispatch with 7-day hassle-free replacement'], 34, 'Flipkart', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Flipkart for maximum savings of ₹2.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('d54e9b74-930f-408c-b008-be0debe823bc', 'Dettol Original Germ Protection Bathing Soap (Pack of 4 x 125g)', 'Personal Care', 'Dettol', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600', '100% better protection against illness-causing germs, dermatologically approved everyday family soap.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('35d2078f-b62b-4854-89df-44f8eac6d8db', 'd54e9b74-930f-408c-b008-be0debe823bc', 'Meesho', 'https://www.meesho.com/search?q=dettol+soap+pack+of+4', 146, 'INR', 4.3, 4200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('415e5d05-a671-4eb0-a67b-91db60dd7034', '35d2078f-b62b-4854-89df-44f8eac6d8db', 157.68, NOW() - INTERVAL '15 days'),
  ('e59bd175-203c-48de-8a41-b1295aab075d', '35d2078f-b62b-4854-89df-44f8eac6d8db', 146, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('e58168d5-d61a-4cfa-880b-5143a2d2768c', '35d2078f-b62b-4854-89df-44f8eac6d8db', 'Verified Customer', 4.3, 'Excellent verified authentic product from Meesho with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('fd7acc0a-0efa-4c54-a2af-57d477b8cea9', 'd54e9b74-930f-408c-b008-be0debe823bc', 'Flipkart', 'https://www.flipkart.com/search?q=dettol+soap+pack+of+4', 152, 'INR', 4.5, 22000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('77301522-1881-47c6-9527-aca6ba053917', 'fd7acc0a-0efa-4c54-a2af-57d477b8cea9', 164.16, NOW() - INTERVAL '15 days'),
  ('b2df9ec8-b268-4719-99fd-ca53a8ca3fa1', 'fd7acc0a-0efa-4c54-a2af-57d477b8cea9', 152, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('6c1fe492-27ed-4d2b-b674-90f3e53ee09a', 'fd7acc0a-0efa-4c54-a2af-57d477b8cea9', 'Verified Customer', 4.5, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('0564c3bf-f17e-4924-a109-73234f16edaf', 'd54e9b74-930f-408c-b008-be0debe823bc', 'Amazon', 'https://www.amazon.in/s?k=dettol+soap+pack+of+4', 155, 'INR', 4.6, 38000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('31f71d14-31a2-4b10-9a2a-a2e2b1bcbab8', '0564c3bf-f17e-4924-a109-73234f16edaf', 167.40, NOW() - INTERVAL '15 days'),
  ('d18af4cb-884c-47cb-a659-03d4076eb9f6', '0564c3bf-f17e-4924-a109-73234f16edaf', 155, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('010e44a1-e2e6-4660-b9d5-1947f3e7ff13', '0564c3bf-f17e-4924-a109-73234f16edaf', 'Verified Customer', 4.6, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('8b49f250-4bcd-4a92-b778-77525eabf76a', 'd54e9b74-930f-408c-b008-be0debe823bc', 'Croma', 'https://www.croma.com/searchB?q=dettol+soap', 164, 'INR', 4.3, 410, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('76423a8e-4a34-4081-bbb3-78fdbbc5b45f', '8b49f250-4bcd-4a92-b778-77525eabf76a', 177.12, NOW() - INTERVAL '15 days'),
  ('6b947642-7b37-4e83-8a2c-aa07faf9f297', '8b49f250-4bcd-4a92-b778-77525eabf76a', 164, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('3c0fbc13-e27d-4952-be57-3538f8fab6ca', '8b49f250-4bcd-4a92-b778-77525eabf76a', 'Verified Customer', 4.3, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('9eb4409d-536e-4ec1-b1eb-cdc34aeb3599', 'd54e9b74-930f-408c-b008-be0debe823bc', 'Meesho', 95, ARRAY['Lowest authenticated price verified at ₹146', 'Guaranteed genuine warranty & authorized seller fulfillment on Meesho', 'Fast express dispatch with 7-day hassle-free replacement'], 146, 'Meesho', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Meesho for maximum savings of ₹18.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('21f98489-904f-4fe1-951d-0e8dc32f7220', 'Dove Cream Beauty Bathing Bar Soap (Pack of 3 x 100g)', 'Personal Care', 'Dove', 'https://images.unsplash.com/photo-1584949591568-80f4f9f60485?q=80&w=600', 'Contains 1/4th moisturizing cream and mild cleansers to help retain skin moisture rather than stripping it.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('c1a4b8c4-ed57-46e3-855a-8e4af3855f60', '21f98489-904f-4fe1-951d-0e8dc32f7220', 'Meesho', 'https://www.meesho.com/search?q=dove+soap+pack+of+3', 128, 'INR', 4.3, 5100, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('25f4fdcc-3f12-423b-9807-1b689239c37a', 'c1a4b8c4-ed57-46e3-855a-8e4af3855f60', 138.24, NOW() - INTERVAL '15 days'),
  ('7e0085e4-2af5-428b-aa40-81ce2dde96d2', 'c1a4b8c4-ed57-46e3-855a-8e4af3855f60', 128, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('96014c91-4048-498a-941d-2b190f6f1f9b', 'c1a4b8c4-ed57-46e3-855a-8e4af3855f60', 'Verified Customer', 4.3, 'Excellent verified authentic product from Meesho with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('6083f3f9-afa2-49aa-b850-5e317aacf7f2', '21f98489-904f-4fe1-951d-0e8dc32f7220', 'Flipkart', 'https://www.flipkart.com/search?q=dove+soap+pack+of+3', 133, 'INR', 4.5, 29000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('8e0005e6-4926-4cfa-9f8a-efbbca331319', '6083f3f9-afa2-49aa-b850-5e317aacf7f2', 143.64, NOW() - INTERVAL '15 days'),
  ('91c4b07c-32a5-4348-9624-278459e429ff', '6083f3f9-afa2-49aa-b850-5e317aacf7f2', 133, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('d1a66ce1-5809-4519-86d2-22ff5a719786', '6083f3f9-afa2-49aa-b850-5e317aacf7f2', 'Verified Customer', 4.5, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('b1c308b6-990e-4301-b0c6-fe8b5d935caa', '21f98489-904f-4fe1-951d-0e8dc32f7220', 'Amazon', 'https://www.amazon.in/s?k=dove+soap+pack+of+3', 136, 'INR', 4.6, 45000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('7701deb5-f3c7-4757-b399-8907efd77841', 'b1c308b6-990e-4301-b0c6-fe8b5d935caa', 146.88, NOW() - INTERVAL '15 days'),
  ('90b7dd47-e46f-47ab-b6f1-cd7bce204a0f', 'b1c308b6-990e-4301-b0c6-fe8b5d935caa', 136, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('8b030d89-c1c1-4f00-968d-f0726ac09be9', 'b1c308b6-990e-4301-b0c6-fe8b5d935caa', 'Verified Customer', 4.6, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('024004fa-cc6b-440d-926b-fde1aebea3a3', '21f98489-904f-4fe1-951d-0e8dc32f7220', 'Croma', 'https://www.croma.com/searchB?q=dove+soap', 144, 'INR', 4.3, 410, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('80fc7c47-b79f-4d40-8ff1-0da5b0fe7c87', '024004fa-cc6b-440d-926b-fde1aebea3a3', 155.52, NOW() - INTERVAL '15 days'),
  ('10e51d40-16a2-4a24-ac48-c3ed5ce5f741', '024004fa-cc6b-440d-926b-fde1aebea3a3', 144, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('027ccc0c-e344-4b57-ae4d-d8cbab547f69', '024004fa-cc6b-440d-926b-fde1aebea3a3', 'Verified Customer', 4.3, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('61ea27ba-4937-43bb-b7ee-0b0b85878134', '21f98489-904f-4fe1-951d-0e8dc32f7220', 'Meesho', 95, ARRAY['Lowest authenticated price verified at ₹128', 'Guaranteed genuine warranty & authorized seller fulfillment on Meesho', 'Fast express dispatch with 7-day hassle-free replacement'], 128, 'Meesho', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Meesho for maximum savings of ₹16.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('c726298e-c8a6-4024-8534-59463cb55ffe', 'Pears Pure & Gentle Bathing Bar with 98% Pure Glycerin (Pack of 3 x 125g)', 'Personal Care', 'Pears', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600', 'Transparent gentle soap with 98% pure glycerin and natural oils to keep skin glowing and hydrated.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('f82ae7e4-22ec-4b7d-a96d-83184ebf2126', 'c726298e-c8a6-4024-8534-59463cb55ffe', 'Meesho', 'https://www.meesho.com/search?q=pears+soap+pack+of+3', 138, 'INR', 4.3, 3400, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('af0bcb02-14b7-445a-b3d9-74d3a6fcc385', 'f82ae7e4-22ec-4b7d-a96d-83184ebf2126', 149.04, NOW() - INTERVAL '15 days'),
  ('090e6234-998b-43eb-8ee9-d4ca718889e2', 'f82ae7e4-22ec-4b7d-a96d-83184ebf2126', 138, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('e9220a7f-e07c-45b4-b86d-6a3d5c09167e', 'f82ae7e4-22ec-4b7d-a96d-83184ebf2126', 'Verified Customer', 4.3, 'Excellent verified authentic product from Meesho with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('0c682029-0a1f-4c8e-bae9-ec3aba251127', 'c726298e-c8a6-4024-8534-59463cb55ffe', 'Flipkart', 'https://www.flipkart.com/search?q=pears+soap+pack+of+3', 144, 'INR', 4.5, 18000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('5f89ed7e-3d65-43a2-880e-9c7b9e2d73e9', '0c682029-0a1f-4c8e-bae9-ec3aba251127', 155.52, NOW() - INTERVAL '15 days'),
  ('496dec5e-a9f1-4771-8c8a-78952a2749f6', '0c682029-0a1f-4c8e-bae9-ec3aba251127', 144, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('61f3e7ce-41c4-4a35-8349-da7a59a73c81', '0c682029-0a1f-4c8e-bae9-ec3aba251127', 'Verified Customer', 4.5, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('0895ba4e-1f49-48e9-aa69-a4198e0522b7', 'c726298e-c8a6-4024-8534-59463cb55ffe', 'Amazon', 'https://www.amazon.in/s?k=pears+soap+pack+of+3', 147, 'INR', 4.6, 31000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('de7da053-f5fa-4c3d-a79d-ba54806929db', '0895ba4e-1f49-48e9-aa69-a4198e0522b7', 158.76, NOW() - INTERVAL '15 days'),
  ('011c2357-2b1e-4c50-91b1-b6b3b4b30594', '0895ba4e-1f49-48e9-aa69-a4198e0522b7', 147, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('535299ed-800a-4bea-be88-537af877b5fd', '0895ba4e-1f49-48e9-aa69-a4198e0522b7', 'Verified Customer', 4.6, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('84f9355c-ef79-4e2e-8395-a27bbf81501c', 'c726298e-c8a6-4024-8534-59463cb55ffe', 'Croma', 'https://www.croma.com/searchB?q=pears+soap', 156, 'INR', 4.3, 320, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('56d7af1a-d02e-4fb9-9108-4d30872d6258', '84f9355c-ef79-4e2e-8395-a27bbf81501c', 168.48, NOW() - INTERVAL '15 days'),
  ('fbdfb4ef-ccf7-4733-ae86-c3fbe99b3226', '84f9355c-ef79-4e2e-8395-a27bbf81501c', 156, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('b5e003de-9ac7-447c-8eee-7331aedd1a57', '84f9355c-ef79-4e2e-8395-a27bbf81501c', 'Verified Customer', 4.3, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('ac0df846-75e3-4711-a78f-aca62f29ecd1', 'c726298e-c8a6-4024-8534-59463cb55ffe', 'Meesho', 95, ARRAY['Lowest authenticated price verified at ₹138', 'Guaranteed genuine warranty & authorized seller fulfillment on Meesho', 'Fast express dispatch with 7-day hassle-free replacement'], 138, 'Meesho', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Meesho for maximum savings of ₹18.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('acb4f077-eaca-4eac-a84b-7e6c0655c37d', 'Tresemme Keratin Smooth Anti-Frizz Hair Shampoo (1 Litre)', 'Personal Care', 'Tresemme', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600', 'Formulated with Keratin and Argan Oil, controls frizz up to 3 days, salon quality smooth hair wash.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('3bf00d04-5017-4620-816d-d8712f48cfa9', 'acb4f077-eaca-4eac-a84b-7e6c0655c37d', 'Meesho', 'https://www.meesho.com/search?q=tresemme+keratin+smooth+1l', 380, 'INR', 4.2, 4100, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('e10cf106-8694-4adc-9085-acf821e2e023', '3bf00d04-5017-4620-816d-d8712f48cfa9', 410.40, NOW() - INTERVAL '15 days'),
  ('ab33f676-9361-4961-8b9b-5cbde192649f', '3bf00d04-5017-4620-816d-d8712f48cfa9', 380, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('33fe221a-3ee9-44ce-bb79-5558233daca5', '3bf00d04-5017-4620-816d-d8712f48cfa9', 'Verified Customer', 4.2, 'Excellent verified authentic product from Meesho with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('9b38388d-a052-4a8d-b42c-ae1b90367701', 'acb4f077-eaca-4eac-a84b-7e6c0655c37d', 'Flipkart', 'https://www.flipkart.com/search?q=tresemme+keratin+smooth+1l', 396, 'INR', 4.4, 24000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('bb794080-713e-4343-8812-720bcde1b291', '9b38388d-a052-4a8d-b42c-ae1b90367701', 427.68, NOW() - INTERVAL '15 days'),
  ('3099d4da-0409-485b-96b9-5926a5b8cf4c', '9b38388d-a052-4a8d-b42c-ae1b90367701', 396, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('eb4d4233-f5f1-4e8a-bc1a-aad6cd584317', '9b38388d-a052-4a8d-b42c-ae1b90367701', 'Verified Customer', 4.4, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('2f08a573-d03e-42b9-a2ef-070b65f68ca1', 'acb4f077-eaca-4eac-a84b-7e6c0655c37d', 'Amazon', 'https://www.amazon.in/s?k=tresemme+keratin+smooth+1l', 404, 'INR', 4.5, 42000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('5d343c40-4a6d-4365-be7f-d6a28242eda7', '2f08a573-d03e-42b9-a2ef-070b65f68ca1', 436.32, NOW() - INTERVAL '15 days'),
  ('2a5e06d0-0e6d-4bcf-bdd5-be1ef6e0381f', '2f08a573-d03e-42b9-a2ef-070b65f68ca1', 404, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('b4187bc8-2d22-4a2b-92cc-7d816eab7aef', '2f08a573-d03e-42b9-a2ef-070b65f68ca1', 'Verified Customer', 4.5, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('5b9f3aa8-4820-4efb-a78d-f2d2c0a43cc6', 'acb4f077-eaca-4eac-a84b-7e6c0655c37d', 'Croma', 'https://www.croma.com/searchB?q=tresemme+shampoo', 428, 'INR', 4.3, 310, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('d0cd419e-5350-4e9f-be17-62b4f9210759', '5b9f3aa8-4820-4efb-a78d-f2d2c0a43cc6', 462.24, NOW() - INTERVAL '15 days'),
  ('ab2c2e1c-79fe-4b1b-9703-09621dcc5a65', '5b9f3aa8-4820-4efb-a78d-f2d2c0a43cc6', 428, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('8aa119aa-d84e-4c53-a9d5-2cfe30f9ff9d', '5b9f3aa8-4820-4efb-a78d-f2d2c0a43cc6', 'Verified Customer', 4.3, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('d198a048-e63f-497b-a0bd-f0076abb35b7', 'acb4f077-eaca-4eac-a84b-7e6c0655c37d', 'Meesho', 95, ARRAY['Lowest authenticated price verified at ₹380', 'Guaranteed genuine warranty & authorized seller fulfillment on Meesho', 'Fast express dispatch with 7-day hassle-free replacement'], 380, 'Meesho', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Meesho for maximum savings of ₹48.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('d383d2f2-8ed2-4dc9-a6a3-df355102463b', 'Fogg Scent Xpressio Long-Lasting Eau De Parfum for Men (100ml)', 'Personal Care', 'Fogg', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600', 'Intense masculine fragrance with fresh oriental notes, long-lasting aroma with zero gas formula.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('1aa05450-7e18-4193-a679-971ce8baf637', 'd383d2f2-8ed2-4dc9-a6a3-df355102463b', 'Meesho', 'https://www.meesho.com/search?q=fogg+scent+xpressio', 242, 'INR', 4.1, 6500, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('6c4ffb0e-c350-4376-8431-5d33b5b54a98', '1aa05450-7e18-4193-a679-971ce8baf637', 261.36, NOW() - INTERVAL '15 days'),
  ('21b5ec44-c98b-4acb-b62d-b30c099a0a32', '1aa05450-7e18-4193-a679-971ce8baf637', 242, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('c01dd3a8-2a32-43ec-b9a8-9a28a45b87ca', '1aa05450-7e18-4193-a679-971ce8baf637', 'Verified Customer', 4.1, 'Excellent verified authentic product from Meesho with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('3fe69b09-9f9c-4a23-bad8-16bcf1f8ea10', 'd383d2f2-8ed2-4dc9-a6a3-df355102463b', 'Flipkart', 'https://www.flipkart.com/search?q=fogg+scent+xpressio', 252, 'INR', 4.3, 34000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('e5902518-fcca-4967-b0d6-c1a028ccc603', '3fe69b09-9f9c-4a23-bad8-16bcf1f8ea10', 272.16, NOW() - INTERVAL '15 days'),
  ('168b7e30-84ad-4c87-8b9a-19c62dc22463', '3fe69b09-9f9c-4a23-bad8-16bcf1f8ea10', 252, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('79c79a9c-c659-4e03-9d3e-e708f559690c', '3fe69b09-9f9c-4a23-bad8-16bcf1f8ea10', 'Verified Customer', 4.3, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('192cee88-2fc5-4596-8a29-3c1c679bb985', 'd383d2f2-8ed2-4dc9-a6a3-df355102463b', 'Amazon', 'https://www.amazon.in/s?k=fogg+scent+xpressio', 257, 'INR', 4.4, 48000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('e35115e4-fab5-40d6-a4de-181d0369c465', '192cee88-2fc5-4596-8a29-3c1c679bb985', 277.56, NOW() - INTERVAL '15 days'),
  ('56c6fa3c-af95-4ec2-a0b6-ec59c6336f57', '192cee88-2fc5-4596-8a29-3c1c679bb985', 257, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('ef11e140-51dd-454d-aa2e-c25f985e89c8', '192cee88-2fc5-4596-8a29-3c1c679bb985', 'Verified Customer', 4.4, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('92cf0145-9122-459d-8d1b-54e688904784', 'd383d2f2-8ed2-4dc9-a6a3-df355102463b', 'Croma', 'https://www.croma.com/searchB?q=fogg+perfume', 272, 'INR', 4.2, 450, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('9038a31f-ff7a-43a4-a8f5-50ce0448caec', '92cf0145-9122-459d-8d1b-54e688904784', 293.76, NOW() - INTERVAL '15 days'),
  ('4c86ba6c-cb8a-4781-8977-7f1303317c9f', '92cf0145-9122-459d-8d1b-54e688904784', 272, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('5d9fe90f-616f-4eb7-aae9-37d2449c06ea', '92cf0145-9122-459d-8d1b-54e688904784', 'Verified Customer', 4.2, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('801f02c5-0a17-48d4-83b5-0bc585c9ebea', 'd383d2f2-8ed2-4dc9-a6a3-df355102463b', 'Meesho', 95, ARRAY['Lowest authenticated price verified at ₹242', 'Guaranteed genuine warranty & authorized seller fulfillment on Meesho', 'Fast express dispatch with 7-day hassle-free replacement'], 242, 'Meesho', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Meesho for maximum savings of ₹30.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('befe2dba-d193-4cf9-917d-e4a176d1bf7c', 'Daawat Rozana Super Basmati Rice (5kg Bag)', 'Groceries', 'Daawat', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600', 'Aromatic long grain basmati rice, aged to perfection, non-sticky fluffy grains for daily meals and biryani.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('97269781-61e7-4792-8f8f-8d1d8ec3065a', 'befe2dba-d193-4cf9-917d-e4a176d1bf7c', 'Meesho', 'https://www.meesho.com/search?q=daawat+basmati+rice+5kg', 349, 'INR', 4.2, 340, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('116af779-a37f-4088-904d-02372c2257bf', '97269781-61e7-4792-8f8f-8d1d8ec3065a', 376.92, NOW() - INTERVAL '15 days'),
  ('93b9af30-04b3-428a-9381-feace5ddbaa8', '97269781-61e7-4792-8f8f-8d1d8ec3065a', 349, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('2a978c9f-cf7e-47df-b3b0-f5c63785a493', '97269781-61e7-4792-8f8f-8d1d8ec3065a', 'Verified Customer', 4.2, 'Excellent verified authentic product from Meesho with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('f0a8e0ac-030e-4a19-a36f-b4128dc0bb35', 'befe2dba-d193-4cf9-917d-e4a176d1bf7c', 'Flipkart', 'https://www.flipkart.com/search?q=daawat+basmati+rice+5kg', 364, 'INR', 4.4, 5200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('a954171e-2900-4aee-a26f-c86dbd652fc8', 'f0a8e0ac-030e-4a19-a36f-b4128dc0bb35', 393.12, NOW() - INTERVAL '15 days'),
  ('8bb89099-cd4b-47cd-8fd4-eb78450d054d', 'f0a8e0ac-030e-4a19-a36f-b4128dc0bb35', 364, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('b0f6e562-3efb-4928-8708-aee4adc145e1', 'f0a8e0ac-030e-4a19-a36f-b4128dc0bb35', 'Verified Customer', 4.4, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('9d062b78-ab0b-401f-9124-b0f0b4162076', 'befe2dba-d193-4cf9-917d-e4a176d1bf7c', 'Amazon', 'https://www.amazon.in/s?k=daawat+basmati+rice+5kg', 371, 'INR', 4.5, 7800, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('8c2a20b1-2e04-4d98-b9db-bfe6374c474a', '9d062b78-ab0b-401f-9124-b0f0b4162076', 400.68, NOW() - INTERVAL '15 days'),
  ('ef73303a-6f62-4461-8055-4519ce008811', '9d062b78-ab0b-401f-9124-b0f0b4162076', 371, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('cf526cdf-74bc-41b4-8685-e12158609364', '9d062b78-ab0b-401f-9124-b0f0b4162076', 'Verified Customer', 4.5, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('9f7857eb-849a-4ca0-a2aa-5aab3f308ee0', 'befe2dba-d193-4cf9-917d-e4a176d1bf7c', 'Croma', 'https://www.croma.com/searchB?q=daawat+rice', 393, 'INR', 4.3, 410, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('4014ca6d-8794-46fa-b72e-49456a66c408', '9f7857eb-849a-4ca0-a2aa-5aab3f308ee0', 424.44, NOW() - INTERVAL '15 days'),
  ('69c2332c-f195-4602-aee2-a926e0b59221', '9f7857eb-849a-4ca0-a2aa-5aab3f308ee0', 393, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('2bce7529-c95a-42fa-9aef-b88b240b5526', '9f7857eb-849a-4ca0-a2aa-5aab3f308ee0', 'Verified Customer', 4.3, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('087db338-92de-43e0-8534-344dcf4c77b0', 'befe2dba-d193-4cf9-917d-e4a176d1bf7c', 'Meesho', 95, ARRAY['Lowest authenticated price verified at ₹349', 'Guaranteed genuine warranty & authorized seller fulfillment on Meesho', 'Fast express dispatch with 7-day hassle-free replacement'], 349, 'Meesho', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Meesho for maximum savings of ₹44.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('f8b25810-d251-4b2b-b3bf-2a5391096344', 'Fortune Sunlite Refined Sunflower Cooking Oil (1 Litre Pouch)', 'Groceries', 'Fortune', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600', 'Light and healthy refined sunflower oil, fortified with Vitamin A and Vitamin D, low absorb technology.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('0a1297d0-af09-4d3f-8598-50fe0fa80ef0', 'f8b25810-d251-4b2b-b3bf-2a5391096344', 'Meesho', 'https://www.meesho.com/search?q=fortune+sunflower+oil+1l', 115, 'INR', 4.2, 340, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('9dc63f56-a082-4936-a86f-387b7a354dbb', '0a1297d0-af09-4d3f-8598-50fe0fa80ef0', 124.20, NOW() - INTERVAL '15 days'),
  ('6501dfac-03da-4f6e-bf7a-a9f2f3200ffd', '0a1297d0-af09-4d3f-8598-50fe0fa80ef0', 115, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('8fc79c72-2627-41c7-999f-b94cbe51d0b3', '0a1297d0-af09-4d3f-8598-50fe0fa80ef0', 'Verified Customer', 4.2, 'Excellent verified authentic product from Meesho with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('04253731-2785-4d07-a552-6b89d0bb6814', 'f8b25810-d251-4b2b-b3bf-2a5391096344', 'Flipkart', 'https://www.flipkart.com/search?q=fortune+sunflower+oil+1l', 120, 'INR', 4.4, 5200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('f4a5d3d2-8f5f-4f7e-b766-724e066ef7c4', '04253731-2785-4d07-a552-6b89d0bb6814', 129.60, NOW() - INTERVAL '15 days'),
  ('2cda9987-3a6b-483b-a2fa-b9d8f2414318', '04253731-2785-4d07-a552-6b89d0bb6814', 120, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('164bf70d-19d5-4cfc-9c02-290738b577b9', '04253731-2785-4d07-a552-6b89d0bb6814', 'Verified Customer', 4.4, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('f7f6208e-0bfa-4f38-b7e6-8e8c0acf581f', 'f8b25810-d251-4b2b-b3bf-2a5391096344', 'Amazon', 'https://www.amazon.in/s?k=fortune+sunflower+oil+1l', 122, 'INR', 4.5, 7800, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('48ae7fe5-e2d2-4ca7-abcd-d332e69c9b8a', 'f7f6208e-0bfa-4f38-b7e6-8e8c0acf581f', 131.76, NOW() - INTERVAL '15 days'),
  ('6610f045-d5eb-4f08-8438-718aca1c348d', 'f7f6208e-0bfa-4f38-b7e6-8e8c0acf581f', 122, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('2ab6e8a2-f697-460b-9dd2-d4cef51d5f47', 'f7f6208e-0bfa-4f38-b7e6-8e8c0acf581f', 'Verified Customer', 4.5, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('3223fe64-e432-493b-8bc8-a2ddcd9bb37a', 'f8b25810-d251-4b2b-b3bf-2a5391096344', 'Croma', 'https://www.croma.com/searchB?q=fortune+oil', 130, 'INR', 4.3, 410, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('43832026-d683-447d-95e5-c6a9b471843e', '3223fe64-e432-493b-8bc8-a2ddcd9bb37a', 140.40, NOW() - INTERVAL '15 days'),
  ('42f18c5f-9d3a-461b-a5d0-196c25c0a98a', '3223fe64-e432-493b-8bc8-a2ddcd9bb37a', 130, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('22f7150f-7dff-424c-a2cf-e5263edcd50d', '3223fe64-e432-493b-8bc8-a2ddcd9bb37a', 'Verified Customer', 4.3, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('c1079f0e-6c64-4829-bc41-019d91e9e9d4', 'f8b25810-d251-4b2b-b3bf-2a5391096344', 'Meesho', 95, ARRAY['Lowest authenticated price verified at ₹115', 'Guaranteed genuine warranty & authorized seller fulfillment on Meesho', 'Fast express dispatch with 7-day hassle-free replacement'], 115, 'Meesho', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Meesho for maximum savings of ₹15.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('eaa0f445-1a75-4194-892e-159e4f2318f2', 'Tata Tea Gold Royal Assam & Darjeeling Long Leaves (500g)', 'Groceries', 'Tata', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600', 'Exquisite blend of 85% rich Assam CTC tea with 15% gently rolled aromatic Darjeeling long leaves.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('1ceab776-501c-4081-885a-942301450ba4', 'eaa0f445-1a75-4194-892e-159e4f2318f2', 'Meesho', 'https://www.meesho.com/search?q=tata+tea+gold+500g', 197, 'INR', 4.2, 340, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('847df38d-aeb8-488c-99ec-b8adb768dc82', '1ceab776-501c-4081-885a-942301450ba4', 212.76, NOW() - INTERVAL '15 days'),
  ('a5914157-daac-4e0c-9e01-6ee9eb492327', '1ceab776-501c-4081-885a-942301450ba4', 197, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('8433699b-9879-4aba-9d1f-8f47d42fb9f5', '1ceab776-501c-4081-885a-942301450ba4', 'Verified Customer', 4.2, 'Excellent verified authentic product from Meesho with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('b9f5a2b5-1b85-4c77-be5a-195338612b47', 'eaa0f445-1a75-4194-892e-159e4f2318f2', 'Flipkart', 'https://www.flipkart.com/search?q=tata+tea+gold+500g', 205, 'INR', 4.4, 5200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('b74dc19c-5bd4-4532-ab7f-e2e0c556ccaa', 'b9f5a2b5-1b85-4c77-be5a-195338612b47', 221.40, NOW() - INTERVAL '15 days'),
  ('ea6619ca-5daf-4060-92a8-add67d3e5ffd', 'b9f5a2b5-1b85-4c77-be5a-195338612b47', 205, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('d2cc71ea-0c2f-47d5-aea2-e80096c32063', 'b9f5a2b5-1b85-4c77-be5a-195338612b47', 'Verified Customer', 4.4, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('503f4c53-6eb9-4131-8c7c-dbde3a05dc46', 'eaa0f445-1a75-4194-892e-159e4f2318f2', 'Amazon', 'https://www.amazon.in/s?k=tata+tea+gold+500g', 209, 'INR', 4.5, 7800, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('656a8817-9cfb-46c3-88a5-3ab3f0c79a57', '503f4c53-6eb9-4131-8c7c-dbde3a05dc46', 225.72, NOW() - INTERVAL '15 days'),
  ('395a3bf4-b72d-4233-863c-4c44672b7443', '503f4c53-6eb9-4131-8c7c-dbde3a05dc46', 209, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('a85ca37d-1e50-451f-b09e-b32ef53ebbbf', '503f4c53-6eb9-4131-8c7c-dbde3a05dc46', 'Verified Customer', 4.5, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('3e370634-b5ee-40bc-a3f4-2631a925aab9', 'eaa0f445-1a75-4194-892e-159e4f2318f2', 'Croma', 'https://www.croma.com/searchB?q=tata+tea+gold', 221, 'INR', 4.3, 410, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('7eb5105f-4c6f-4783-9939-cf267a4a4ce4', '3e370634-b5ee-40bc-a3f4-2631a925aab9', 238.68, NOW() - INTERVAL '15 days'),
  ('020ac988-3e05-4723-8293-f3855c1f54ed', '3e370634-b5ee-40bc-a3f4-2631a925aab9', 221, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('35b928a9-8797-4a40-b911-336df9de5277', '3e370634-b5ee-40bc-a3f4-2631a925aab9', 'Verified Customer', 4.3, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('8e6f4549-0879-4736-9374-58404fc169a9', 'eaa0f445-1a75-4194-892e-159e4f2318f2', 'Meesho', 95, ARRAY['Lowest authenticated price verified at ₹197', 'Guaranteed genuine warranty & authorized seller fulfillment on Meesho', 'Fast express dispatch with 7-day hassle-free replacement'], 197, 'Meesho', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Meesho for maximum savings of ₹24.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('d26faf96-6cab-4533-9ce6-117af70dbb57', 'Prestige Induction Cooktop with Indian Menu Presets (2000W)', 'Appliances', 'Prestige', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600', 'Push button controls, Indian menu options, automatic voltage regulator, anti-magnetic wall protection.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('5dc3f22d-4020-4848-b685-10eb7901cdd1', 'd26faf96-6cab-4533-9ce6-117af70dbb57', 'Flipkart', 'https://www.flipkart.com/search?q=prestige+induction+cooktop', 1586, 'INR', 4.4, 14500, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('381f64a0-46dd-49a2-9945-0ee70ea13081', '5dc3f22d-4020-4848-b685-10eb7901cdd1', 1712.88, NOW() - INTERVAL '15 days'),
  ('9fdbac9d-83bf-4003-9b20-1094757bbc7d', '5dc3f22d-4020-4848-b685-10eb7901cdd1', 1586, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('5def3903-d5bd-4b31-a8eb-e2f33120484f', '5dc3f22d-4020-4848-b685-10eb7901cdd1', 'Verified Customer', 4.4, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('c17acdca-fec6-474b-bb72-2e4c5917898c', 'd26faf96-6cab-4533-9ce6-117af70dbb57', 'Amazon', 'https://www.amazon.in/s?k=prestige+induction+cooktop', 1618, 'INR', 4.5, 22000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('217c737a-0e95-4365-b969-65b8297f12ed', 'c17acdca-fec6-474b-bb72-2e4c5917898c', 1747.44, NOW() - INTERVAL '15 days'),
  ('ac153694-88ff-493d-8443-fbd3100cdbe9', 'c17acdca-fec6-474b-bb72-2e4c5917898c', 1618, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('a3bf545b-3736-49e6-9af2-da271b35e564', 'c17acdca-fec6-474b-bb72-2e4c5917898c', 'Verified Customer', 4.5, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('91911bde-ede1-4b74-9e6d-98162326aa08', 'd26faf96-6cab-4533-9ce6-117af70dbb57', 'Croma', 'https://www.croma.com/searchB?q=prestige+induction', 1713, 'INR', 4.3, 1400, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('a9d51889-efd5-4158-93fe-69c556a15fc5', '91911bde-ede1-4b74-9e6d-98162326aa08', 1850.04, NOW() - INTERVAL '15 days'),
  ('a399e5e6-69ac-4340-8a99-3c6583fde138', '91911bde-ede1-4b74-9e6d-98162326aa08', 1713, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('4e2bb8e4-0109-49b1-8eeb-e13c737c2aca', '91911bde-ede1-4b74-9e6d-98162326aa08', 'Verified Customer', 4.3, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('bd8bf250-f05d-4c1d-9326-fe531ee2dca8', 'd26faf96-6cab-4533-9ce6-117af70dbb57', 'Flipkart', 95, ARRAY['Lowest authenticated price verified at ₹1,586', 'Guaranteed genuine warranty & authorized seller fulfillment on Flipkart', 'Fast express dispatch with 7-day hassle-free replacement'], 1586, 'Flipkart', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Flipkart for maximum savings of ₹127.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('77d15842-b6bd-4cf6-8955-3b1dd42a4742', 'Philips Digital Air Fryer with Rapid Air Technology (4.1 Litre)', 'Appliances', 'Philips', 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?q=80&w=600', 'Fry, bake, grill, roast and reheat with up to 90% less fat using Rapid Air Technology and digital touch screen.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('6cba85c1-c238-49bb-8828-16457fba7cc9', '77d15842-b6bd-4cf6-8955-3b1dd42a4742', 'Flipkart', 'https://www.flipkart.com/search?q=philips+digital+air+fryer', 4328, 'INR', 4.4, 7800, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('da9973ab-8db6-4600-aac9-9aae84c7bee3', '6cba85c1-c238-49bb-8828-16457fba7cc9', 4674.24, NOW() - INTERVAL '15 days'),
  ('e0f01d87-4931-4eec-9f6d-efa69e8f5f18', '6cba85c1-c238-49bb-8828-16457fba7cc9', 4328, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('fa8ac621-00b5-419f-9c36-7a0572882e5a', '6cba85c1-c238-49bb-8828-16457fba7cc9', 'Verified Customer', 4.4, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('b789adb2-7def-4e41-9641-15ab6d36bf2e', '77d15842-b6bd-4cf6-8955-3b1dd42a4742', 'Amazon', 'https://www.amazon.in/s?k=philips+digital+air+fryer', 4415, 'INR', 4.5, 14200, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('e4d86743-f6f6-45cd-bf80-e2907f2821ef', 'b789adb2-7def-4e41-9641-15ab6d36bf2e', 4768.20, NOW() - INTERVAL '15 days'),
  ('afde9024-1ce6-468c-a3dd-b47fd19d29a7', 'b789adb2-7def-4e41-9641-15ab6d36bf2e', 4415, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('a6d545fc-f5b6-4b36-98d9-164d6b6820b0', 'b789adb2-7def-4e41-9641-15ab6d36bf2e', 'Verified Customer', 4.5, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('8695bb61-06a6-4fbb-ad95-b160841234a6', '77d15842-b6bd-4cf6-8955-3b1dd42a4742', 'Croma', 'https://www.croma.com/searchB?q=philips+air+fryer', 4674, 'INR', 4.3, 890, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('b1f49d79-200e-4012-8174-151f65332fbf', '8695bb61-06a6-4fbb-ad95-b160841234a6', 5047.92, NOW() - INTERVAL '15 days'),
  ('5703f8d2-09e5-4148-bd69-419581336534', '8695bb61-06a6-4fbb-ad95-b160841234a6', 4674, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('62ab1f2c-a83c-44aa-a2cd-033fd295a613', '8695bb61-06a6-4fbb-ad95-b160841234a6', 'Verified Customer', 4.3, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('62c87723-0226-4085-9f3f-997ff010e082', '77d15842-b6bd-4cf6-8955-3b1dd42a4742', 'Flipkart', 95, ARRAY['Lowest authenticated price verified at ₹4,328', 'Guaranteed genuine warranty & authorized seller fulfillment on Flipkart', 'Fast express dispatch with 7-day hassle-free replacement'], 4328, 'Flipkart', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Flipkart for maximum savings of ₹346.', NOW());

INSERT INTO "products" ("id", "name", "category", "brand", "image_url", "description", "created_at") VALUES
  ('1e8ff3ea-9650-4cb4-ac2f-ad84c89215c5', 'Portronics Luxcell B12 10000mAh Power Bank (12W Fast Charge, Dual Output)', 'Electronics', 'Portronics', 'https://images.unsplash.com/photo-1609592424368-80f4f9f60485?q=80&w=600', 'Ultra-slim lightweight design, 12W dual output ports (USB-A & Type-C), LED battery indicator, BIS certified.', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('9709df10-eb07-450a-8f90-5e7673e396e6', '1e8ff3ea-9650-4cb4-ac2f-ad84c89215c5', 'Flipkart', 'https://www.flipkart.com/search?q=portronics+power+bank', 530, 'INR', 4.3, 18000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('963b02de-bcc1-459e-879c-b228e777bcdd', '9709df10-eb07-450a-8f90-5e7673e396e6', 572.40, NOW() - INTERVAL '15 days'),
  ('64e8d718-318b-4d74-8a0e-2f7d7514748e', '9709df10-eb07-450a-8f90-5e7673e396e6', 530, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('130137fe-b2c9-45e4-9ca1-b052d9e3dd83', '9709df10-eb07-450a-8f90-5e7673e396e6', 'Verified Customer', 4.3, 'Excellent verified authentic product from Flipkart with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('00c3d828-38ad-42bc-bb24-33b951c19275', '1e8ff3ea-9650-4cb4-ac2f-ad84c89215c5', 'Amazon', 'https://www.amazon.in/s?k=portronics+power+bank', 549, 'INR', 4.4, 29000, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('838e4907-7f9b-4a9e-bb80-bd27f1a710b3', '00c3d828-38ad-42bc-bb24-33b951c19275', 592.92, NOW() - INTERVAL '15 days'),
  ('ab17eb26-3f9e-4694-8a66-3c336a99e4aa', '00c3d828-38ad-42bc-bb24-33b951c19275', 549, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('1340c941-3ac1-470d-a55f-2d439ad12500', '00c3d828-38ad-42bc-bb24-33b951c19275', 'Verified Customer', 4.4, 'Excellent verified authentic product from Amazon with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "product_listings" ("id", "product_id", "seller_name", "seller_url", "price", "currency", "rating", "review_count", "delivery_time", "offers", "last_scraped_at") VALUES
  ('7024eb5d-a717-4569-b897-03654a6c8a23', '1e8ff3ea-9650-4cb4-ac2f-ad84c89215c5', 'Croma', 'https://www.croma.com/searchB?q=portronics+power+bank', 599, 'INR', 4.2, 510, '2-3 Days', '10% Instant Bank Discount', NOW());

INSERT INTO "price_history" ("id", "listing_id", "price", "recorded_at") VALUES
  ('7d208713-a681-4a90-8fc2-69013e80b7f9', '7024eb5d-a717-4569-b897-03654a6c8a23', 646.92, NOW() - INTERVAL '15 days'),
  ('6c8693ac-68e3-4f95-a745-5f51178f56d7', '7024eb5d-a717-4569-b897-03654a6c8a23', 599, NOW());

INSERT INTO "reviews" ("id", "listing_id", "reviewer_name", "rating", "review_text", "sentiment_score", "summarized_text", "scraped_at") VALUES
  ('24ca1f69-aea7-479b-92d4-414200b6c687', '7024eb5d-a717-4569-b897-03654a6c8a23', 'Verified Customer', 4.2, 'Excellent verified authentic product from Croma with fast shipping.', 0.92, 'Highly recommended', NOW());

INSERT INTO "platform_recommendations" ("id", "product_id", "recommended_platform", "confidence_score", "reasons", "best_price", "best_seller", "fastest_delivery", "best_offer", "verdict_summary", "created_at") VALUES
  ('813c1a73-4382-4451-822c-e72171d4e571', '1e8ff3ea-9650-4cb4-ac2f-ad84c89215c5', 'Flipkart', 95, ARRAY['Lowest authenticated price verified at ₹530', 'Guaranteed genuine warranty & authorized seller fulfillment on Flipkart', 'Fast express dispatch with 7-day hassle-free replacement'], 530, 'Flipkart', '1-2 Days Express', 'Bank Offer & Instant Savings', 'Recommended to purchase on Flipkart for maximum savings of ₹69.', NOW());

