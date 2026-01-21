import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Website Performance & Accessibility Tests', () => {

    test('Homepage should be accessible', async ({ page }) => {
        await page.goto('/');

        // Inject axe-core and verify accessibility
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        // Log violations if any
        if (accessibilityScanResults.violations.length > 0) {
            console.log('Accessibility Violations Summary:');
            accessibilityScanResults.violations.forEach(v => {
                console.log(`- ID: ${v.id}, Impact: ${v.impact}, Help: ${v.help}`);
                v.nodes.forEach(n => console.log(`  Node: ${n.html}`));
            });
        }

        // Assert no critical violations
        // We allow some minor ones for now, but ideally this should be 0
        expect(accessibilityScanResults.violations.filter(v => v.impact === 'critical')).toEqual([]);
    });

    test('Navigation to Products page should be fast and accurate', async ({ page }) => {
        await page.goto('/');

        const startTime = Date.now();

        // Click "Shop" dropdown then "All Products"
        // Since dropdown hover might be tricky, we can also test direct navigation or click specific visible links
        // Testing the "Shop Now" button in Hero section for simplicity
        await page.getByRole('link', { name: 'SHOP NOW' }).click();

        await expect(page).toHaveURL(/.*products/);

        const loadTime = Date.now() - startTime;
        console.log(`Navigation to Products took ${loadTime}ms`);

        // Basic performance assertion
        expect(loadTime).toBeLessThan(3000);
    });

    test('Add to Cart functionality', async ({ page }) => {
        await page.goto('/products');

        // Wait for products to load
        await page.waitForSelector('.group');

        // FIX: Target the button directly by text to guarantee we get a Product Card button
        // This avoids accidentally selecting a non-product '.group' element
        const addToCartBtn = page.locator('button').filter({ hasText: 'Add To Cart' }).first();

        // Ensure button is visible
        await expect(addToCartBtn).toBeVisible();
        await addToCartBtn.click();
        await page.waitForTimeout(1000);
        await expect(page.getByText('Added to cart')).toBeVisible();

        // Check for success toast or cart badge update
        // Checking cart badge
        const cartBadge = page.locator('a[href="/cart"] span');
        await expect(cartBadge).toBeVisible();
        await expect(cartBadge).toHaveText(/[1-9]/);
    });
});
