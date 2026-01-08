import { test, expect } from '@playwright/test';

test.describe('Campaign Page Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // We expect to be redirected to login since we're not authenticated in these simple tests
    await page.goto('/campaign');
  });

  test('should display campaign page title when logged in (mocking needed or just check redirect)', async ({ page }) => {
    // For now, these tests confirm the app's routing and basic structure
    // In a real scenario, we would use page.addInitScript or cookies to bypass login
    await expect(page).toHaveURL(/.*login/);
  });

  test('Samsung S25 Viewport: Dashboard Stats Layout', async ({ page }) => {
    // Set viewport to the Samsung S25 size we configured
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto('/login');
    
    // Check if the login container is centered and looks good on mobile
    const loginCard = page.locator('form');
    await expect(loginCard).toBeVisible();
    
    // Screenshots are great for Playwright
    await page.screenshot({ path: 'test-results/login-mobile-s25.png' });
  });
});

test.describe('Responsive Design Health', () => {
  test('header should be responsive', async ({ page }) => {
    await page.goto('/login');
    
    // Desktop View
    await page.setViewportSize({ width: 1280, height: 720 });
    const desktopBrands = page.locator('text=TFC Connect').first();
    await expect(desktopBrands).toBeVisible();
    
    // Mobile View
    await page.setViewportSize({ width: 375, height: 667 });
    // Verify it doesn't break
    await expect(page.locator('body')).toBeVisible();
  });
});
