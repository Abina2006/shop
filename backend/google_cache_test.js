import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function runTest() {
  const urlToSearch = 'https://www.meesho.com/hoppup-xo3-gaming-earbuds-with-35ms-low-latency-13mm-drivers-50h-playtime-bluetooth-headset-white-true-wireless/p/6rupef';
  const cacheUrl = `https://webcache.googleusercontent.com/search?q=cache:${urlToSearch}`;
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.goto(cacheUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  
  const html = await page.content();
  console.log(`Cache HTML length: ${html.length}`);
  if (html.includes('404. That’s an error.')) {
     console.log('Not in Google Cache.');
  }
  
  await browser.close();
}

runTest();
