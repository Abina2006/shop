import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function runTest() {
  console.log('Taking screenshot of Amazon...');
  
  const url = 'https://www.amazon.in/dp/B0CHX1W1XY';
  
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  
  await page.screenshot({ path: 'amazon_screenshot.png' });
  
  const html = await page.content();
  console.log("HTML length:", html.length);
  
  const price = await page.evaluate(() => {
    const el1 = document.querySelector('.a-price-whole');
    const el2 = document.querySelector('.a-offscreen');
    const el3 = document.querySelector('#corePrice_desktop .a-price-whole');
    const el4 = document.querySelector('.apexPriceToPay .a-offscreen');
    
    // Grab all prices just to see
    const allPrices = Array.from(document.querySelectorAll('.a-price-whole')).map(el => el.innerText);
    
    return {
      el1: el1 ? el1.innerText : null,
      el2: el2 ? el2.innerText : null,
      el3: el3 ? el3.innerText : null,
      el4: el4 ? el4.innerText : null,
      allPrices: allPrices.slice(0, 5),
      title: document.title
    };
  });
  
  console.log("Extracted:", price);
  await browser.close();
}

runTest();
