import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function runTest() {
  const urls = [
    'https://www.amazon.in/dp/B0CHX1W1XY', // iPhone 15
    'https://www.flipkart.com/boat-airdopes-alpha-35-hrs-playtime-13mm-drivers-dual-mic-enx-tws-earbuds/p/itm5a3b9f71c4c92', // boAt Earbuds
    'https://www.meesho.com/hoppup-xo3-gaming-earbuds-with-35ms-low-latency-13mm-drivers-50h-playtime-bluetooth-headset-white-true-wireless/p/6rupef' // Meesho Earbuds
  ];
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));
    
    const price = await page.evaluate(() => {
      let extractedPrice = null;
      
      // 1. Try JSON-LD
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const script of scripts) {
        try {
          const data = JSON.parse(script.innerText);
          // Handle both single object and array of objects
          const items = Array.isArray(data) ? data : [data];
          for (const item of items) {
            if (item['@type'] === 'Product' || item['@type'] === 'ProductGroup') {
              if (item.offers && item.offers.price) {
                extractedPrice = item.offers.price;
                break;
              }
              if (item.offers && item.offers.lowPrice) {
                 extractedPrice = item.offers.lowPrice;
                 break;
              }
              if (Array.isArray(item.offers) && item.offers.length > 0 && item.offers[0].price) {
                 extractedPrice = item.offers[0].price;
                 break;
              }
            }
          }
        } catch(e) {}
        if (extractedPrice) break;
      }
      return extractedPrice;
    });
    
    console.log(`URL: ${url}`);
    console.log(`JSON-LD Price: ${price}`);
    await page.close();
  }
  
  await browser.close();
}

runTest();
