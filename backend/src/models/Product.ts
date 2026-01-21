import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    user: mongoose.Schema.Types.ObjectId;
    name: string;
    image: string;
    images: string[];
    description: string;
    reviews: any[]; // Using any for subdocument array or create separate interface if strict
    rating: number;
    numReviews: number;
    price: number;
    countInStock: number;
    category: string;
    weight: string;
}

const reviewSchema = new Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const productSchema = new Schema<IProduct>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        images: [
            {
                type: String,
            },
        ],
        description: {
            type: String,
            required: true,
        },
        reviews: [reviewSchema],
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0,
        },
        category: {
            type: String,
            required: true,
        },
        weight: {
            type: String,
            required: false,
            default: '250g'
        }
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
