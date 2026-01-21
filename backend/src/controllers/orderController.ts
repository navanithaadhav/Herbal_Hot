import { Request, Response } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import sendEmail from '../utils/emailService';
dotenv.config();

interface AuthenticatedRequest extends Request {
    user?: any;
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req: AuthenticatedRequest, res: Response) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        // Send Order Confirmation Email
        try {
            await sendEmail({
                email: req.user.email,
                subject: `Order Confirmation - ${createdOrder._id}`,
                message: `Hi ${req.user.name},\n\nThanks for your order at Masala Store.\n\nYour order ID is: ${createdOrder._id}\nTotal Amount: RS ${totalPrice}\nPayment Method: ${paymentMethod}\n\nWe will notify you once it ships.\n\nView Order: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/order/${createdOrder._id}`,
                html: `
                    <h1>Order Confirmation</h1>
                    <p>Hi ${req.user.name},</p>
                    <p>Thanks for your order at <strong>Masala Store</strong>.</p>
                    <p><strong>Order ID:</strong> ${createdOrder._id}</p>
                    <p><strong>Total Amount:</strong> ₹${totalPrice}</p>
                    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                    <hr/>
                    <p>We will notify you once it ships.</p>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/order/${createdOrder._id}" style="padding: 10px 20px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 5px;">View Order</a>
                `
            });
        } catch (error) {
            console.error('Order Email Failed:', error);
            // Non-blocking: don't fail the order if email fails
        }

        if (paymentMethod === 'Razorpay') {
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID || '',
                key_secret: process.env.RAZORPAY_KEY_SECRET || '',
            });

            const options = {
                amount: Math.round(totalPrice * 100), // amount in lowest denomination
                currency: 'INR',
                receipt: createdOrder._id.toString(),
            };

            try {
                const response = await razorpay.orders.create(options);
                res.status(201).json({ ...createdOrder.toObject(), razorpayOrderId: response.id });
                return;
            } catch (error) {
                console.error('Razorpay Order Creation Error:', error);
                // Fallback: return order without razorpay ID, frontend will handle or fail
            }
        }

        res.status(201).json(createdOrder);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req: AuthenticatedRequest, res: Response) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req: AuthenticatedRequest, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        // Strict Verification for Razorpay
        if (order.paymentMethod === 'Razorpay') {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

            if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
                res.status(400).json({ message: 'Payment verification failed: Missing required fields' });
                return;
            }

            const body = razorpay_order_id + '|' + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
                .update(body.toString())
                .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                res.status(400).json({ message: 'Payment verification failed: Invalid signature' });
                return;
            }
        }

        order.isPaid = true;
        order.paidAt = new Date();
        // Payment result comes from payment gateway
        order.paymentResult = {
            id: req.body.razorpay_payment_id || req.body.id,
            status: req.body.status || 'COMPLETED',
            update_time: req.body.update_time || new Date().toISOString(),
            email_address: req.body.email_address || req.user.email,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order to shipped
// @route   PUT /api/orders/:id/ship
// @access  Private/Admin
const updateOrderToShipped = async (req: AuthenticatedRequest, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isShipped = true;
        order.shippedAt = new Date();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req: AuthenticatedRequest, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = new Date();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req: AuthenticatedRequest, res: Response) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req: Request, res: Response) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
};

// @desc    Get dashboard stats
// @route   GET /api/orders/stats
// @access  Private/Admin
const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        const orders = await Order.find();
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        // Calculate highly moving products (top 5 by quantity sold)
        // We use MongoDB aggregation pipeline
        const topProducts = await Order.aggregate([
            { $unwind: '$orderItems' }, // Deconstruct orderItems array
            {
                $group: {
                    _id: '$orderItems.product', // Group by product ID
                    name: { $first: '$orderItems.name' }, // Get name
                    totalSold: { $sum: '$orderItems.qty' }, // Sum quantity
                },
            },
            { $sort: { totalSold: -1 } }, // Sort descending
            { $limit: 5 }, // Top 5
        ]);

        const stats = {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            topProducts,
        };
        console.log('Dashboard Stats:', stats);

        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get sales analytics (Weekly/Monthly)
// @route   GET /api/orders/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = async (req: Request, res: Response) => {
    try {
        const { range } = req.query;

        let matchStage: any = {};

        if (range !== 'all') {
            const days = range === 'monthly' ? 30 : 7;
            const date = new Date();
            date.setDate(date.getDate() - days);
            matchStage = {
                createdAt: { $gte: date }
            };
        }

        const salesData = await Order.aggregate([
            {
                $match: matchStage
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: "$totalPrice" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(salesData);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get top products analytics (Weekly/Monthly)
// @route   GET /api/orders/analytics/products
// @access  Private/Admin
const getTopProductsAnalytics = async (req: Request, res: Response) => {
    try {
        const { range } = req.query;

        let matchStage: any = {};

        if (range !== 'all') {
            const days = range === 'monthly' ? 30 : 7;
            const date = new Date();
            date.setDate(date.getDate() - days);
            matchStage = {
                createdAt: { $gte: date }
            };
        }

        const topProducts = await Order.aggregate([
            {
                $match: matchStage
            },
            { $unwind: '$orderItems' },
            {
                $group: {
                    _id: '$orderItems.product',
                    name: { $first: '$orderItems.name' },
                    totalSold: { $sum: '$orderItems.qty' }
                }
            },
            { $sort: { totalSold: -1 } }
        ]);

        res.json(topProducts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToShipped,
    getMyOrders,
    getOrders,
    getDashboardStats,
    getSalesAnalytics,
    getTopProductsAnalytics,
    updateOrderToDelivered
};
