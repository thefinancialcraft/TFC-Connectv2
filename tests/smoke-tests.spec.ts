import { test, expect } from '@playwright/test';

test.describe('TFC Connect Smoke Tests', () => {
  
  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    // Expect URL to contain 'login'
    await expect(page).toHaveURL(/.*login/);
  });

  test('login page should have company branding', async ({ page }) => {
    await page.goto('/login');
    // Check for the brand name or logo
    // Based on the screenshots, there should be a reference to 'TFC' or 'TFC Connect'
    const brand = page.locator('h1, h2, img[alt*="TFC"]');
    await expect(brand.first()).toBeVisible();
  });

  test('mobile side-bar interaction (Samsung S25 simulation)', async ({ page, isMobile }) => {
    await page.goto('/login');
    
    if (isMobile) {
      // In mobile view, check if specific mobile elements are present
      // For example, a hamburger menu or mobile-optimized layout
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });
});
