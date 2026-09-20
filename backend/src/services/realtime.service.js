import prisma from '../config/db.js';


// In-memory set of connected SSE response objects
const clients = new Set();

/**
 * Add a new client SSE response stream.
 */
export function addClient(res) {
  clients.add(res);
}

/**
 * Remove a client SSE response stream upon disconnect.
 */
export function removeClient(res) {
  clients.delete(res);
}

/**
 * Broadcast an event payload to all connected SSE clients.
 */
export function broadcastEvent(eventType, data) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    try {
      client.write(payload);
    } catch {
      clients.delete(client);
    }
  }
}

/**
 * Broadcast a live scraper log message to all connected clients.
 */
export function broadcastScraperLog(message, type = 'info', metadata = {}) {
  broadcastEvent('scraper-log', {
    timestamp: new Date().toLocaleTimeString(),
    message,
    type,
    ...metadata,
  });
}

/**
 * Broadcast a price update event.
 */
export function broadcastPriceUpdate(productId, listingId, sellerName, oldPrice, newPrice, productName) {
  broadcastEvent('price-update', {
    timestamp: new Date().toLocaleTimeString(),
    productId,
    listingId,
    sellerName,
    oldPrice: parseFloat(oldPrice),
    newPrice: parseFloat(newPrice),
    productName,
    diff: parseFloat((newPrice - oldPrice).toFixed(2)),
  });
}
