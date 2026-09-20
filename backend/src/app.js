// Database URL is configured in .env — no runtime modification needed

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Enable CORS
app.use(cors());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serve static product images from /public/images
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/images', express.static(path.join(__dirname, '../../public/images')));

// Auth Routes
import authRoutes from './modules/auth/auth.routes.js';
app.use('/api/auth', authRoutes);

// Product Routes (scraping, catalog, reviews)
import productRoutes from './modules/product/product.routes.js';
app.use('/api/products', productRoutes);

// AI Platform Advisor Routes
import platformAdvisorRoutes from './modules/platformAdvisor/platformAdvisor.routes.js';
app.use('/api/platform-advisor', platformAdvisorRoutes);

// Wishlist Routes
import wishlistRoutes from './modules/wishlist/wishlist.routes.js';
app.use('/api/wishlist', wishlistRoutes);

// Price Alerts Routes
import priceAlertRoutes from './modules/priceAlert/priceAlert.routes.js';
app.use('/api/price-alerts', priceAlertRoutes);

// Root & Health Check Routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 ShopWise AI Backend API is live & connected!',
    environment: process.env.NODE_ENV || 'production',
    endpoints: {
      products: '/api/products',
      platformAdvisor: '/api/platform-advisor',
      priceAlerts: '/api/price-alerts',
      wishlist: '/api/wishlist',
      auth: '/api/auth',
      health: '/health'
    }
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ShopWise AI API Root'
  });
});

// PostgreSQL Test DB API Route
import pool from '../database.js';

app.get('/api/test-db', async (req, res) => {
  try {
    const client = await pool.connect();
    client.release();
    res.status(200).json({
      success: true,
      message: 'Database connected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ShopWise AI API is healthy and running.'
  });
});

// Mock Product Pages for Sandbox/Offline Scrapy Testing
app.get('/mock-product/:id', (req, res) => {
  const { id } = req.params;
  let product = {
    name: "boAt Airdopes Alpha",
    brand: "boAt",
    price: 799,
    rating: 4.2,
    reviewCount: 145,
    category: "Audio",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=300",
    description: "boAt Airdopes Alpha with 35ms Low Latency, Dual Mics ENx Tech, and 35 Hours Playback.",
    reviews: [
      { author: "Rohan K", rating: 5, text: "Unbelievable battery backup and sound signature. Super latency mode works perfect for gaming!" },
      { author: "Sneha P", rating: 4, text: "Excellent fit and lightweight. Call quality is crisp." }
    ]
  };

  if (id === 'headphones') {
    product = {
      name: "Sony WH-1000XM5 Wireless Headphones",
      brand: "Sony",
      price: 29990,
      rating: 4.7,
      reviewCount: 312,
      category: "Audio",
      imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=300",
      description: "Advanced Active Noise Canceling Wireless Over-ear headphones with premium sound quality.",
      reviews: [
        { author: "Kabir S", rating: 5, text: "Noise cancellation is otherworldly. Very comfortable for long hours." },
        { author: "Divya M", rating: 4, text: "Sound quality is amazing but case is a bit bulky." }
      ]
    };
  } else if (id === 'watch') {
    product = {
      name: "Samsung Galaxy Watch 6 LTE",
      brand: "Samsung",
      price: 19999,
      rating: 4.4,
      reviewCount: 98,
      category: "Wearables",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300",
      description: "Smartwatch with sleep coaching, body composition analysis, heart rhythm tracking.",
      reviews: [
        { author: "Aditya R", rating: 5, text: "Super accurate fitness tracking. AMOLED display is gorgeous." },
        { author: "Pooja G", rating: 4, text: "Battery lasts about 1.5 days. Overall user interface is smooth." }
      ]
    };
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrl,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount
    },
    "review": product.reviews.map(r => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": r.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating
      },
      "reviewBody": r.text
    }))
  };

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${product.name} - ShopWise Mock Store</title>
      <meta name="description" content="${product.description}">
      <meta property="og:title" content="${product.name}">
      <meta property="og:description" content="${product.description}">
      <meta property="og:image" content="${product.imageUrl}">
      <meta property="product:price:amount" content="${product.price}">
      <script type="application/ld+json">
        \${JSON.stringify(jsonLd, null, 2)}
      </script>
    </head>
    <body style="background-color: #0f172a; color: #f8fafc; font-family: sans-serif; padding: 2rem;">
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #334155; padding: 2rem; border-radius: 1rem; background-color: #1e293b;">
        <img src="\${product.imageUrl}" alt="\${product.name}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 0.5rem;"/>
        <h1 style="font-size: 1.8rem; margin: 1rem 0 0.5rem 0;">\${product.name}</h1>
        <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 1rem;">Brand: \${product.brand} | Category: \${product.category}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <span style="font-size: 1.5rem; font-weight: bold; color: #818cf8;">₹\${product.price}</span>
          <span style="color: #fbbf24;">★ \${product.rating} (\${product.reviewCount} reviews)</span>
        </div>
        <p style="line-height: 1.5; font-size: 0.95rem; color: #cbd5e1;">\${product.description}</p>
        
        <h2 style="font-size: 1.2rem; margin-top: 2rem; border-bottom: 1px solid #334155; padding-bottom: 0.5rem;">Customer Reviews</h2>
        <div style="margin-top: 1rem;">
          \${product.reviews.map(r => \`
            <div style="background-color: #0f172a; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.5rem; border: 1px solid #1e293b;">
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 0.85rem; color: #cbd5e1; margin-bottom: 0.3rem;">
                <span>\${r.author}</span>
                <span style="color: #fbbf24;">★ \${r.rating}</span>
              </div>
              <p style="margin: 0; font-size: 0.9rem; color: #94a3b8;">\${r.text}</p>
            </div>
          \`).join('')}
        </div>
      </div>
    </body>
    </html>
  `);
});

// Centralized error handler fallback
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || null
  });
});

export default app;
