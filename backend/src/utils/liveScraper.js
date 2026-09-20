import { extractProductFromUrlFallback } from '../modules/product/product.service.js';
import { validateAndSanitizePrice } from './priceValidator.js';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
];

async function scrapeWithFetch(url, seller) {
  let priceText = null;
  let ogImage = null;
  let ogTitle = null;

  try {
    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    const res = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,en-IN;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!res.ok) {
      console.warn(`[liveScraper] Fetch failed for ${url} with status ${res.status}`);
      return { priceText, ogImage, ogTitle };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    ogImage = $('meta[property="og:image"]').attr('content') 
      || $('meta[name="twitter:image"]').attr('content') 
      || $('#landingImage').attr('src')
      || $('.v2VFa-').attr('src');

    ogTitle = $('meta[property="og:title"]').attr('content') 
      || $('meta[name="twitter:title"]').attr('content') 
      || $('title').text();

    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html());
        const offers = json.offers || (json['@graph'] && json['@graph'].find(x => x.offers)?.offers);
        if (offers) {
          if (Array.isArray(offers) && offers[0].price) priceText = String(offers[0].price);
          else if (offers.price) priceText = String(offers.price);
          else if (offers.lowPrice) priceText = String(offers.lowPrice);
        }
      } catch(e) {}
    });

    if (!priceText) {
      if (seller === 'Amazon') {
        priceText = $('.a-price-whole').first().text() || $('#priceblock_ourprice').text();
      } else if (seller === 'Flipkart') {
        priceText = $('div.Nx9bqj.CxhGGd').first().text() || $('div._30jeq3._16Jk6d').first().text();
      } else if (seller === 'Myntra') {
        priceText = $('span.pdp-price').first().text();
      } else if (seller === 'Meesho') {
        priceText = $('h4').first().text(); 
      }
    }

    if (!priceText) {
      const genericPrice = $('.price, .amount, [class*="price" i], [id*="price" i]').first().text();
      if (genericPrice && genericPrice.match(/₹|rs|inr|\$|[0-9]/i)) {
        priceText = genericPrice;
      }
    }

    console.log(`[liveScraper] Cheerio extracted price: ${priceText}, title: ${ogTitle}`);
  } catch (err) {
    console.error(`[liveScraper] Fetch/Cheerio error for ${url}:`, err.message);
  }

  return { priceText, ogImage, ogTitle };
}

/**
 * Enhanced Puppeteer Stealth Browser Scraper with Akamai Bot Protection Evasion
 */
async function scrapeWithPuppeteer(url, seller) {
  let browser = null;
  try {
    console.log(`[liveScraper] Launching Puppeteer Stealth browser with Akamai bypass for: ${url}`);
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--window-size=1920,1080',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(USER_AGENTS[0]);

    // Mask webdriver signature
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en-IN', 'en'] });
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));

    const pageTitle = await page.title();
    if (pageTitle.includes('Access Denied') || pageTitle.includes('Security Check') || pageTitle.includes('Robot Check')) {
      console.warn(`[liveScraper] Bot protection block detected ("${pageTitle}").`);
      await browser.close();
      return { priceText: null, ogImage: null, ogTitle: null, blocked: true };
    }

    const scrapedData = await page.evaluate(() => {
      let extractedPrice = null;
      let title = document.title || '';
      let img = null;

      const metaImg = document.querySelector('meta[property="og:image"]') || document.querySelector('meta[name="twitter:image"]');
      if (metaImg) img = metaImg.getAttribute('content');

      const ldScripts = document.querySelectorAll('script[type="application/ld+json"]');
      ldScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent);
          const offers = data.offers || (data['@graph'] && data['@graph'].find(x => x.offers)?.offers);
          if (offers) {
            if (Array.isArray(offers) && offers[0].price) extractedPrice = String(offers[0].price);
            else if (offers.price) extractedPrice = String(offers.price);
          }
        } catch(e) {}
      });

      if (!extractedPrice) {
        const textNodes = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
          const txt = node.nodeValue.trim();
          if (txt.match(/₹\s*[0-9,]+/i) || txt.match(/rs\.?\s*[0-9,]+/i)) {
            textNodes.push(txt);
          }
        }

        if (textNodes.length > 0) {
          const firstPriceMatch = textNodes[0].match(/(?:₹|rs\.?|inr)[^\d]*([0-9,]+)/i);
          if (firstPriceMatch) extractedPrice = firstPriceMatch[1];
        }
      }

      return { extractedPrice, title, img };
    });

    await browser.close();
    return {
      priceText: scrapedData.extractedPrice,
      ogImage: scrapedData.img,
      ogTitle: scrapedData.title,
      blocked: false
    };
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    console.warn(`[liveScraper] Puppeteer error for ${url}:`, err.message);
    return { priceText: null, ogImage: null, ogTitle: null, blocked: true };
  }
}

export async function scrapeProductData(url) {
  console.log(`[liveScraper] Scraping data via Fetch + Puppeteer Stealth for: ${url}`);
  
  const fallbackItems = extractProductFromUrlFallback(url);
  if (fallbackItems.length === 0) return [];
  
  const item = fallbackItems[0];
  const seller = item.seller_name;
  
  let { priceText, ogImage, ogTitle } = await scrapeWithFetch(url, seller);

  if (!priceText) {
    console.log(`[liveScraper] Fetch yielded no price, escalating to Puppeteer Stealth browser...`);
    const pupData = await scrapeWithPuppeteer(url, seller);
    if (pupData.priceText) priceText = pupData.priceText;
    if (pupData.ogImage && !pupData.ogImage.includes('Access Denied')) ogImage = pupData.ogImage;
    if (pupData.ogTitle && !pupData.ogTitle.includes('Access Denied')) ogTitle = pupData.ogTitle;
  }
  
  if (priceText) {
    const parsedPrice = validateAndSanitizePrice(priceText, item.name, seller);
    if (parsedPrice !== null) {
      item.price = parsedPrice;
      item.priceStatus = 'VERIFIED';
      console.log(`[liveScraper] Scraped live price: ₹${parsedPrice} from ${seller}`);
    }
  }
  
  if (ogImage && ogImage.trim() !== '' && !ogImage.includes('Access Denied')) {
    item.image_url = ogImage;
  }
  
  if (ogTitle && ogTitle.trim().length > 0 && !ogTitle.includes('Access Denied')) {
    let cleanTitle = ogTitle.replace(/Buy|Online|at Lowest Price|in India|from|Flipkart\.com|Amazon\.in/gi, '').trim();
    cleanTitle = cleanTitle.replace(/\||-/, '').trim();
    if (cleanTitle.length > 5) {
      item.name = cleanTitle;
    }
  }
  
  return [item];
}

export async function fetchLivePriceOnly(url, sellerName) {
  let { priceText } = await scrapeWithFetch(url, sellerName);
  if (!priceText) {
    const pupData = await scrapeWithPuppeteer(url, sellerName);
    priceText = pupData.priceText;
  }
  if (priceText) {
    return validateAndSanitizePrice(priceText, 'Unknown', sellerName);
  }
  return null;
}
