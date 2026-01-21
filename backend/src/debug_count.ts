import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';
import User from './models/User';
import Order from './models/Order';
import connectDB from './config/db';

dotenv.config();

const debugCounts = async () => {
    try {
        await connectDB();

        const productCount = await Product.countDocuments();
        const userCount = await User.countDocuments();
        const orderCount = await Order.countDocuments();

        console.log(JSON.stringify({
            productCount,
            userCount,
            orderCount
        }));

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugCounts();
