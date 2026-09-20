import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

async function runTest() {
  const url = 'https://www.meesho.com/hoppup-xo3-gaming-earbuds-with-35ms-low-latency-13mm-drivers-50h-playtime-bluetooth-headset-white-true-wireless/p/6rupef';
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });
  
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  
  await page.screenshot({ path: 'C:\\Users\\ADMIN\\.gemini\\antigravity-ide\\brain\\681cce37-66a3-4dca-b3b7-ad1ec5cf992e\\meesho_visible_screenshot.png' });
  
  const html = await page.content();
  fs.writeFileSync('meesho_html.txt', html);
  
  await browser.close();
}

runTest();
