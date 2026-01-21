import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
    // Generate a unqiue user for each run to avoid conflicts
    const randomId = Math.floor(Math.random() * 10000);
    const testUser = {
        name: `Test User ${randomId}`,
        email: `testuser${randomId}@example.com`,
        password: 'password123',
        confirmPassword: 'password123'
    };

    test('should register a new user successfully', async ({ page }) => {
        await page.goto('/register');

        // Fill registration form
        await page.getByTestId('register-name').fill(testUser.name);
        await page.getByTestId('register-email').fill(testUser.email);
        await page.getByTestId('register-password').fill(testUser.password);
        await page.getByTestId('register-confirm-password').fill(testUser.confirmPassword);

        // Submit
        await page.getByTestId('register-submit').click();

        // Expect to be redirected or see success message
        // Verify user is logged in (usually name appears in header)
        await expect(page.getByText(testUser.name)).toBeVisible();

        // Also verify redirected to home or profile
        await expect(page).toHaveURL('/');
    });

    test('should logout successfully', async ({ page }) => {
        // Fast-forward: Register a user for this specific test
        await page.goto('/register');
        const uniqueEmail = `logout${Date.now()}@test.com`;
        await page.getByTestId('register-name').fill('Logout Tester');
        await page.getByTestId('register-email').fill(uniqueEmail);
        await page.getByTestId('register-password').fill('123456');
        await page.getByTestId('register-confirm-password').fill('123456');
        await page.getByTestId('register-submit').click();
        await expect(page.getByText('Logout Tester')).toBeVisible();

        // Perform Logout
        // Assuming there is a User Menu dropdown
        await page.getByText('Logout Tester').click(); // Click profile dropdown
        await page.getByText('Logout').click();

        // Verify logged out state
        await expect(page.getByText('Sign In')).toBeVisible();
        // Or check that profile name is gone
        await expect(page.getByText('Logout Tester')).not.toBeVisible();
    });

    test('should show error for invalid login credentials', async ({ page }) => {
        await page.goto('/login');

        await page.getByTestId('login-email').fill('wrong@example.com');
        await page.getByTestId('login-password').fill('wrongpassword');
        await page.getByTestId('login-submit').click();

        // Expect error toast or message
        // Adjust this selector based on your Toast library or error alert
        await expect(page.getByText('Invalid email or password')).toBeVisible();
    });
});
