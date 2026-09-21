import { chromium, expect } from '@playwright/test';
const base = process.env.BASE_URL || 'http://localhost:5174';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  const paths = ['/', '/campusfeed', '/campusfeed/a-lifetime-network', '/campusfeed/missing', '/events', '/events/1', '/events/missing', '/galleries', '/members', '/search', '/map', '/jobs', '/jobs?tab=e_internships', '/about', '/contact', '/platform/invitation', '/addon/1534'];
  for (const width of [1440, 900, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of paths) {
      await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('main h1')).toBeVisible({ timeout: 20000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: ${path} overflow`).toBeTruthy();
    }
    console.log(`PASS ${paths.length} public routes at ${width}px`);
  }
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('button', { name: 'Careers', exact: true }).click();
  await page.getByRole('link', { name: 'Internship', exact: true }).click();
  await expect(page).toHaveURL(/jobs\?tab=e_internships/);
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'Events', exact: true }).click();
  await page.getByRole('link', { name: 'Galleries', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Events', exact: true })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Events', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await page.goto(`${base}/members`);
  await page.getByRole('link', { name: '2021 Explore the batch' }).click();
  await expect(page).toHaveURL(/search\?batch=2021/);
  await expect(page.locator('.static-person')).toHaveCount(7);
  await page.getByPlaceholder('Search name, trade, company or city').fill('Priya');
  await expect(page.locator('.static-person')).toHaveCount(1);
  await page.getByPlaceholder('Search name, trade, company or city').fill('not-a-person');
  await expect(page.getByText('No matches yet.')).toBeVisible();
  await page.goto(`${base}/galleries`);
  await page.getByRole('button', { name: 'Skills', exact: true }).click();
  await expect(page.locator('.static-gallery figure')).toHaveCount(2);
  await page.goto(`${base}/platform/invitation`);
  await page.getByRole('button', { name: 'Copy invitation' }).click();
  await expect(page.getByRole('button', { name: 'Invitation copied' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(base);
  await page.goto(`${base}/about`);
  const light = await page.locator('.public-site').evaluate(el => getComputedStyle(el).backgroundColor);
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  const dark = await page.locator('.public-site').evaluate(el => getComputedStyle(el).backgroundColor);
  expect(dark).not.toBe(light);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
  await page.screenshot({ path: '/tmp/alumni-public-dark.png', fullPage: true });
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await page.screenshot({ path: '/tmp/alumni-public-light.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/`);
  await expect(page.locator('.hero h1')).toBeVisible({ timeout: 20000 });
  await page.screenshot({ path: '/tmp/alumni-public-mobile.png', fullPage: true });
  expect(errors).toEqual([]);
  console.log('PASS navigation, keyboard, filtering, invitations, theme persistence, and runtime checks');
} finally { await browser.close(); }
