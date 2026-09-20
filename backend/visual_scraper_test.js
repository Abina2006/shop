import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function runTest() {
  const url = 'https://www.amazon.in/dp/B0CHX1W1XY';
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  
  const price = await page.evaluate(() => {
    // Collect all elements that look like prices
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    const priceCandidates = [];
    
    let node;
    while (node = walker.nextNode()) {
      const text = node.nodeValue.trim();
      if (text.match(/₹|rs\.?|inr/i)) {
        // Move up to the closest container that holds the full price
        let el = node.parentElement;
        if (!el) continue;
        
        // On Amazon, the span containing ₹ might be separate from the numbers.
        // Go up a few levels to capture the whole price block
        let container = el;
        for (let i=0; i<3; i++) {
            if (container.parentElement && container.parentElement.textContent.trim().length < 50) {
                container = container.parentElement;
            }
        }
        
        const fullText = container.textContent.replace(/\s+/g, '');
        const match = fullText.match(/(?:₹|rs\.?|inr)[^\d]*([0-9,]+(\.[0-9]{1,2})?)/i);
        if (match) {
           const style = window.getComputedStyle(el);
           priceCandidates.push({
             price: match[1],
             fontSize: parseFloat(style.fontSize) || 0,
             fontWeight: parseInt(style.fontWeight) || 400,
             text: fullText
           });
        }
      }
    }
    
    if (priceCandidates.length === 0) {
       // Secondary fallback: just match body text for any number over 1000
       const matches = document.body.innerText.match(/(?:₹|rs\.?|inr)[^\d]*([0-9,]+)/gi) || [];
       const highPrices = matches.map(m => m.replace(/[^\d]/g, '')).filter(p => parseInt(p) > 1000);
       return highPrices.length > 0 ? highPrices[0] : null;
    }

    // Sort by font size descending, then font weight
    priceCandidates.sort((a, b) => {
       if (b.fontSize !== a.fontSize) return b.fontSize - a.fontSize;
       return b.fontWeight - a.fontWeight;
    });
    
    return priceCandidates[0].price;
  });
  
  console.log(`Amazon URL: ${url}`);
  console.log(`Smart Visual Price: ${price}`);
  await browser.close();
}

runTest();
