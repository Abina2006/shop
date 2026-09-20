import nodemailer from 'nodemailer';
import prisma from '../config/db.js';
import { broadcastScraperLog } from './realtime.service.js';


// Setup Nodemailer transporter with test/SMTP fallback
let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Generate test Ethereal transporter or simulated console logger
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('\n📧 =================== [EMAIL DISPATCH SIMULATION] ===================');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Product: ${mailOptions.productName || 'Catalog Product'}`);
        console.log(`Alert Drop Price: ₹${mailOptions.price}`);
        console.log('===================================================================\n');
        return { messageId: `sim_${Date.now()}` };
      }
    };
  }

  return transporter;
}

/**
 * Dispatch Price Drop Notification Email
 */
export async function sendPriceDropEmail({ userEmail, productName, storeName, currentPrice, targetPrice, storeUrl }) {
  const mailClient = await getTransporter();

  const formattedCurrent = Number(currentPrice).toLocaleString('en-IN');
  const formattedTarget = Number(targetPrice).toLocaleString('en-IN');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
          .card { max-width: 540px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 28px; }
          .badge { display: inline-block; background-color: #10b981; color: #ffffff; font-weight: bold; font-size: 12px; padding: 4px 10px; border-radius: 9999px; margin-bottom: 12px; }
          .title { font-size: 20px; font-weight: 800; color: #ffffff; margin-top: 0; }
          .price-box { background-color: #0f172a; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid #334155; text-align: center; }
          .current-price { font-size: 28px; font-weight: 800; color: #34d399; }
          .target-price { font-size: 13px; color: #94a3b8; margin-top: 4px; }
          .btn { display: block; width: 100%; box-sizing: border-box; background-color: #4f46e5; color: #ffffff !important; font-weight: 700; text-align: center; padding: 14px 20px; border-radius: 12px; text-decoration: none; margin-top: 20px; }
          .footer { font-size: 11px; color: #64748b; text-align: center; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">🔥 PRICE DROP ALERT HIT!</div>
          <h1 class="title">${productName}</h1>
          <p style="color: #cbd5e1; font-size: 14px; margin: 0;">Good news! The price has dropped below your target threshold on <strong>${storeName}</strong>.</p>
          
          <div class="price-box">
            <div class="current-price">₹${formattedCurrent}</div>
            <div class="target-price">Your Target Price was: ₹${formattedTarget}</div>
          </div>

          <a href="${storeUrl || 'http://localhost:3000'}" class="btn" target="_blank">
            Buy Now on ${storeName} ↗
          </a>

          <div class="footer">
            Sent by ShopWise AI Price Monitor • Real-time Multi-store Intelligence
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await mailClient.sendMail({
      from: '"ShopWise AI Alerts" <alerts@shopwise.ai>',
      to: userEmail,
      subject: `🚨 Price Drop Alert: ${productName} is now ₹${formattedCurrent} on ${storeName}!`,
      productName,
      price: formattedCurrent,
      html: htmlContent
    });

    console.log(`✅ [PriceAlertService] Alert email sent to ${userEmail} for "${productName}" (₹${formattedCurrent})`);
    broadcastScraperLog(`🔔 Price Alert Dispatched: Email sent to ${userEmail} for ${productName} (₹${formattedCurrent})`, 'success');
    return true;
  } catch (err) {
    console.error(`❌ [PriceAlertService] Failed to send email to ${userEmail}:`, err.message);
    return false;
  }
}

/**
 * Scan all active price alerts in database and trigger notifications if current price <= targetPrice
 */
export async function checkAndTriggerPriceAlerts() {
  console.log('🔍 [PriceAlertService] Scanning active price alerts against live product prices...');

  const activeAlerts = await prisma.priceAlert.findMany({
    where: { isActive: true },
    include: {
      user: true,
      listing: {
        include: { product: true }
      }
    }
  });

  if (activeAlerts.length === 0) {
    console.log('ℹ️ [PriceAlertService] No active price alerts to evaluate.');
    return { evaluated: 0, triggered: 0 };
  }

  let triggeredCount = 0;

  for (const alert of activeAlerts) {
    const currentPrice = parseFloat(alert.listing.price);
    const targetPrice = parseFloat(alert.targetPrice);

    if (currentPrice <= targetPrice) {
      console.log(`🎯 [PriceAlertService] Threshold reached! Alert ${alert.id}: Current ₹${currentPrice} <= Target ₹${targetPrice}`);
      
      const sent = await sendPriceDropEmail({
        userEmail: alert.user.email,
        productName: alert.listing.product.name,
        storeName: alert.listing.sellerName,
        currentPrice: currentPrice,
        targetPrice: targetPrice,
        storeUrl: alert.listing.sellerUrl
      });

      if (sent) {
        triggeredCount++;
      }
    }
  }

  console.log(`✅ [PriceAlertService] Price alert scan complete. Evaluated: ${activeAlerts.length}, Triggered: ${triggeredCount}`);
  return { evaluated: activeAlerts.length, triggered: triggeredCount };
}
