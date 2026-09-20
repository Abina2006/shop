import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function runTest() {
  console.log('Taking screenshot of Meesho...');
  
  const url = 'https://www.meesho.com/hoppup-xo3-gaming-earbuds-with-35ms-low-latency-13mm-drivers-50h-playtime-bluetooth-headset-white-true-wireless/p/6rupef';
  
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  
  await page.screenshot({ path: 'meesho_screenshot.png' });
  
  const html = await page.content();
  console.log("HTML length:", html.length);
  
  const price = await page.evaluate(() => {
    return {
      title: document.title,
      h4: document.querySelector('h4') ? document.querySelector('h4').innerText : null,
      generic: document.body.innerText.match(/(?:₹|rs\.?|inr)\s*([0-9,]+)/i) ? document.body.innerText.match(/(?:₹|rs\.?|inr)\s*([0-9,]+)/i)[0] : null
    };
  });
  
  console.log("Extracted:", price);
  await browser.close();
}

runTest();
