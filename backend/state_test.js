import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function runTest() {
  const url = 'https://www.meesho.com/hoppup-xo3-gaming-earbuds-with-35ms-low-latency-13mm-drivers-50h-playtime-bluetooth-headset-white-true-wireless/p/6rupef';
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  
  const state = await page.evaluate(() => {
    // Check for NEXT_DATA, INITIAL_STATE, window.state
    let price = null;
    
    // Check Next.js __NEXT_DATA__
    const nextData = document.querySelector('#__NEXT_DATA__');
    if (nextData) {
       try {
         const json = JSON.parse(nextData.innerText);
         const str = JSON.stringify(json);
         const match = str.match(/"price":\s*([0-9]+)/i) || str.match(/"originalPrice":\s*([0-9]+)/i) || str.match(/"discountedPrice":\s*([0-9]+)/i);
         if (match) price = match[1];
       } catch (e) {}
    }
    
    // Check all scripts for JSON
    if (!price) {
      const scripts = document.querySelectorAll('script');
      for (const s of scripts) {
         if (s.innerText.includes('price')) {
             const match = s.innerText.match(/"(?:discountedPrice|sellingPrice|price)"\s*:\s*([0-9]+)/i);
             if (match) {
                price = match[1];
                break;
             }
         }
      }
    }
    
    return price;
  });
  
  console.log(`State Price extracted: ${state}`);
  await browser.close();
}

runTest();
