
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Load env from backend root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_URL = 'http://localhost:5000/api';
// Use the credentials from your seed data or a known user
const EMAIL = 'admin@example.com';
const PASSWORD = 'password123';

async function runTest() {
    try {
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/users/login`, {
            email: EMAIL,
            password: PASSWORD
        });
        const token = loginRes.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log('Logged in successfully.');

        console.log('2. Creating Order...');
        const orderRes = await axios.post(`${API_URL}/orders`, {
            orderItems: [
                {
                    name: 'Test Product',
                    qty: 1,
                    image: '/images/sample.jpg',
                    price: 100,
                    product: '63d6b6e5b47a1c5d30800001' // Requires a valid product ID. If fails, we might need to fetch products first.
                }
            ],
            shippingAddress: {
                address: '123 Test St',
                city: 'Test City',
                postalCode: '12345',
                country: 'Test Country'
            },
            paymentMethod: 'Razorpay',
            itemsPrice: 100,
            taxPrice: 18,
            shippingPrice: 0,
            totalPrice: 118
        }, config);

        const orderId = orderRes.data._id;
        const razorpayOrderId = orderRes.data.razorpayOrderId;
        console.log(`Order Created: ${orderId}, Razorpay Order ID: ${razorpayOrderId}`);

        console.log('3. Simulating Payment & Generating Signature...');
        const razorpayPaymentId = 'pay_fake_' + Date.now();
        const secret = process.env.RAZORPAY_KEY_SECRET || '';
        if (!secret) throw new Error('RAZORPAY_KEY_SECRET not found in .env');

        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const signature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        console.log('4. Verifying Payment with Backend...');
        const payRes = await axios.put(`${API_URL}/orders/${orderId}/pay`, {
            razorpay_payment_id: razorpayPaymentId,
            razorpay_order_id: razorpayOrderId,
            razorpay_signature: signature,
            status: 'COMPLETED',
            email_address: EMAIL
        }, config);

        if (payRes.status === 200 && payRes.data.isPaid) {
            console.log('SUCCESS: Payment verified and order marked as paid.');
        } else {
            console.log('FAILURE: Order not marked as paid.');
        }

        console.log('5. Testing Invalid Signature (Expect Failure)...');
        try {
            await axios.put(`${API_URL}/orders/${orderId}/pay`, {
                razorpay_payment_id: razorpayPaymentId,
                razorpay_order_id: razorpayOrderId,
                razorpay_signature: 'invalid_signature_string',
            }, config);
            console.log('FAILURE: Invalid signature was accepted!');
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                console.log('SUCCESS: Invalid signature correctly rejected.');
            } else {
                console.log('FAILURE: Unexpected error for invalid signature:', error.message);
            }
        }

    } catch (error: any) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
        // Special handling if product ID is invalid
        if (error.response?.data?.message?.includes('Product not found')) {
            console.log('Use a real product ID from your database in the script.');
        }
    }
}

runTest();
