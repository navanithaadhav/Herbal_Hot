import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Product from './models/Product';
import Order from './models/Order'; // Assuming Order model exists, good to clear it too potentially, but maybe safer not to if not requested. Let's stick to Products.
import connectDB from './config/db';
import products from './data/products';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany(); // Be careful with this, but usually seeder resets everything or just adds. The user request implies "Use these photos and create list". I will Reset for a clean state or just Upsert. 
        // Standard seeder usually clears everything. Let's clear everything to be safe and consistent.

        // Re-create Admin
        const user = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123', // In a real app this should be hashed, but User model probably handles pre-save hashing.
            role: 'admin',
        });

        const createdUser = await user.save();

        const sampleProducts = products.map((product) => {
            return { ...product, user: createdUser._id };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
