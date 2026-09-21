import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto(process.env.BASE_URL || 'http://localhost:5174');
  await page.locator('.hero').waitFor();
  await page.screenshot({ path: '/tmp/home-light.png', fullPage: true });
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Switch to light theme' }).waitFor();
  if (await page.locator('html').getAttribute('data-theme') !== 'dark') throw Error('Theme persistence failed');
  await page.screenshot({ path: '/tmp/home-dark.png', fullPage: true });
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) throw Error(`Overflow at ${width}: ${await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > innerWidth + 1).map(el => el.className).slice(0, 25).join(', '))}`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'News & Stories' }).click();
  if (await page.getByRole('button', { name: 'Open navigation' }).getAttribute('aria-expanded') !== 'false') throw Error('Menu did not close');
  await page.goto(process.env.BASE_URL || 'http://localhost:5174');
  await page.locator('.hero').waitFor();
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Switch to dark theme' }).waitFor();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: '/tmp/home-mobile.png', fullPage: true });
  if (errors.length) throw Error(errors.join('\n'));
  console.log('PASS: theme persistence in both directions, mobile navigation, six responsive widths, no runtime errors');
} finally {
  await browser.close();
}
