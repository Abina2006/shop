import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function runTest() {
  const url = 'https://www.amazon.in/dp/B0CHX1W1XY'; // iPhone 15 Amazon
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });
  
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  
  const price = await page.evaluate(() => {
    // Find all elements containing ₹ or Rs
    const elements = Array.from(document.querySelectorAll('*'))
      .filter(el => {
        // Only get leaf nodes (elements with no children, or where text is direct child)
        return el.children.length === 0 && el.textContent.match(/₹|rs\.?/i) && el.textContent.match(/[0-9,]+/);
      });
      
    if (elements.length === 0) return null;

    // Get computed font size for each and sort descending
    const prices = elements.map(el => {
      const style = window.getComputedStyle(el);
      const fontSize = parseFloat(style.fontSize);
      const text = el.textContent.trim();
      // Try to extract the number
      const match = text.match(/([0-9,]+(\.[0-9]{1,2})?)/);
      const numericPrice = match ? match[1] : text;
      
      return { text: numericPrice, fontSize, raw: text, tagName: el.tagName };
    }).filter(p => parseFloat(p.text.replace(/,/g, '')) > 0);
    
    prices.sort((a, b) => b.fontSize - a.fontSize);
    
    return prices.length > 0 ? prices[0].text : null;
  });
  
  console.log("Extracted Price by Font Size:", price);
  await browser.close();
}

runTest();
