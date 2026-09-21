import { chromium, expect } from '@playwright/test';
const base = process.env.BASE_URL || 'http://localhost:5174';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
try {
  for (const role of ['admin', 'alumni']) {
    const context = await browser.newContext();
    await context.addInitScript(role => localStorage.setItem('authRole', role), role);
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`${page.url()}: ${error.message}`));
    page.on('console', message => { if (message.type() === 'error' && !message.text().includes('Failed to load resource')) errors.push(`${page.url()}: ${message.text()}`); });
    const shared = ['jobs', 'jobs/1', 'jobs/missing', 'events', 'events/1', 'events/missing', 'groups', 'groups/1', 'groups/missing', 'mentorship', 'announcements', 'messages', 'settings'];
    const specific = role === 'admin'
      ? ['', 'overview', 'connect', 'alumni', 'alumni/ALM-1024', 'alumni/missing', 'verification', 'batches', 'programs', 'campuses', 'job-roles', 'companies', 'companies/1', 'reports', 'notifications']
      : ['', 'profile', 'profile/ALM-1025', 'profile/missing', 'batch', 'directory', 'connect', 'calls', 'resources'];
    for (const route of [...specific, ...shared]) {
      await page.goto(`${base}/${role}/${route}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.loading')).toHaveCount(0);
      await expect(page.locator('main')).toBeVisible();
      console.log(`PASS: /${role}/${route}`);
    }
    await context.close();
  }
  if (errors.length) throw Error([...new Set(errors)].join('\n'));
} finally { if (errors.length) console.error(errors.join('\n')); await browser.close(); }
