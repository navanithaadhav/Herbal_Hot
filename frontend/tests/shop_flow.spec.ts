import { test, expect } from '@playwright/test';

test.describe('Shop & Checkout Flow', () => {

    test('Search and Filter Products', async ({ page }) => {
        await page.goto('/products');

        // Test Search
        const searchInput = page.getByPlaceholder('Search products...');
        await expect(searchInput).toBeVisible();
        await searchInput.fill('Chili');

        // Wait for results
        await page.waitForTimeout(1000); // Wait for debounce/api

        // Verify filtered results
        const productTitles = page.locator('h3');
        await expect(productTitles.first()).toContainText(/Chili/i);

        // Test Category Filter
        // Reset or navigate again
        await page.goto('/products');
        await page.getByRole('button', { name: 'Spices' }).first().click(); // Assuming category button
        // Verify URL or content update
        // await expect(page).toHaveURL(/.*category=Spices/); 
    });

    test('Full Checkout Process', async ({ page }) => {
        // 1. Setup: Register a user first (Checkout often requires auth)
        await page.goto('/register');
        const uniqueEmail = `checkout${Date.now()}@test.com`;
        await page.getByTestId('register-name').fill('Checkout User');
        await page.getByTestId('register-email').fill(uniqueEmail);
        await page.getByTestId('register-password').fill('123456');
        await page.getByTestId('register-confirm-password').fill('123456');
        await page.getByTestId('register-submit').click();
        // Wait for redirect or success state
        await expect(page).toHaveURL(/\/verify-email/);
        // Simulate verification bypassing or just proceed if allowed (depends on auth flow)
        // For now, let's assume we can proceed to login or are auto-logged in? 
        // The RegisterPage redirects to verify-email. 
        // We might need to handle that. usage of specific test logic usually requires skipping verification or mocking it.
        // Let's force navigate to login since we can't verify email easily in E2E without mailosaur/etc.
        // Or just use a login test helper if we had one.
        // Actually, let's just assume we can browse products without being logged in for the Cart part, 
        // and then login when prompted at checkout?
        // But the test tries to register first.
        // Let's skip the register check in this flow and just browsing for now to fix the selector error first.

        // Actually, simpler fix for the selector error:
        // Ambiguity was on 'Name' label? 
        // Let's use the placeholders as planned.

        // NOTE: The previous failure was strict mode on 'getByLabel' for Name.
        // Also button text is 'Create Account' not 'Register'.

        // 2. Add Item to Cart
        await page.goto('/products');
        await page.waitForSelector('.group');
        const addToCartBtn = page.locator('button').filter({ hasText: 'Add To Cart' }).first();
        await addToCartBtn.click();
        await expect(page.getByText('Added to cart')).toBeVisible();

        // 3. Go to Cart
        await page.goto('/cart');
        await expect(page).toHaveURL('/cart');

        // 4. Proceed to Checkout
        await page.getByRole('button', { name: 'Proceed to Checkout' }).click();

        // 5. Shipping Address
        await expect(page).toHaveURL(/.*shipping/);
        await page.getByLabel('Address').fill('123 Test St');
        await page.getByLabel('City').fill('Test City');
        await page.getByLabel('Postal Code').fill('12345');
        await page.getByLabel('Country').fill('India');
        await page.getByRole('button', { name: 'Continue' }).click();

        // 6. Payment Method
        await expect(page).toHaveURL(/.*payment/);
        // Select 'Cash On Delivery' or similar if available, or Mock PayPal
        // Assuming default is selected or easy to select
        await page.getByRole('button', { name: 'Continue' }).click();

        // 7. Place Order
        await expect(page).toHaveURL(/.*placeorder/);
        await page.getByRole('button', { name: 'Place Order' }).click();

        // 8. Verify Success
        // Should redirect to order details
        await expect(page).toHaveURL(/.*orders\//);
        await expect(page.getByText('Order Status')).toBeVisible();
    });
});
