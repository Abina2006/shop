import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function runTest() {
  const urlToSearch = 'https://www.meesho.com/hoppup-xo3-gaming-earbuds-with-35ms-low-latency-13mm-drivers-50h-playtime-bluetooth-headset-white-true-wireless/p/6rupef';
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(urlToSearch)}+price`;
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.goto(googleSearchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  
  const price = await page.evaluate(() => {
    // Look for price in Google search snippets
    const match = document.body.innerText.match(/(?:₹|rs\.?|inr)[^\d]*([0-9,]+)/i);
    return match ? match[1] : null;
  });
  
  console.log(`Google Fallback Price: ${price}`);
  await browser.close();
}

runTest();
