import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import connectDB from './config/db';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/razorpay', (req: Request, res: Response) => {
    res.send({ keyId: process.env.RAZORPAY_KEY_ID });
});

import uploadRoutes from './routes/uploadRoutes';
app.use('/api/upload', uploadRoutes);

// make uploads folder static (for legacy/fallback)
import path from 'path';
app.use('/uploads', express.static(path.join(path.resolve(), '/uploads')));

app.get('/', (req: Request, res: Response) => {
    res.send('Masala API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
