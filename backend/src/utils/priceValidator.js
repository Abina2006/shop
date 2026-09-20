/**
 * Price Validator & Sanitizer Utility
 * Ensures all prices written to PostgreSQL or returned to clients are verified, valid numbers.
 */

export function validateAndSanitizePrice(rawPrice, productName = '', sellerName = '') {
  let price = typeof rawPrice === 'string' ? parseFloat(rawPrice.replace(/[^0-9.]/g, '')) : parseFloat(rawPrice);

  if (isNaN(price) || price <= 0) {
    console.warn(`⚠️ [PriceValidator] Invalid price detected for "${productName}" (${sellerName}): ${rawPrice}. Defaulting to null.`);
    return null;
  }

  // Sanity check for extreme anomalies
  const nameLower = productName.toLowerCase();
  
  // High-value electronics (iPhones, MacBooks, Flagship Galaxy) shouldn't be below ₹10,000
  if ((nameLower.includes('iphone') || nameLower.includes('macbook') || nameLower.includes('galaxy s24')) && price < 10000) {
    console.warn(`⚠️ [PriceValidator] Anomaly: Premium device "${productName}" has suspiciously low price ₹${price}. Flagging.`);
  }

  // Budget accessories (mics, soaps, cables) shouldn't be ₹50,000+
  if ((nameLower.includes('soap') || nameLower.includes('microphone') || nameLower.includes('lavalier') || nameLower.includes('k8')) && price > 5000) {
    console.warn(`⚠️ [PriceValidator] Anomaly: Low-cost item "${productName}" has excessively high price ₹${price}. Flagging.`);
  }

  console.log(`✅ [PriceValidator] Verified price for "${productName}" on ${sellerName}: ₹${price}`);
  return Math.round(price * 100) / 100;
}
