import { Request, Response } from 'express';
import Product from '../models/Product';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req: Request, res: Response) => {
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    // Cast keyword to any to avoid TS issues with Mongoose filter
    const products = await Product.find({ ...keyword } as any);
    res.json(products);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req: any, res: Response) => {
    const product = new Product({
        name: 'Sample Name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        images: ['/images/sample.jpg'],
        category: 'Sample Category',
        weight: '0g',
        countInStock: 0,
        description: 'Sample description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req: Request, res: Response) => {
    const { name, price, description, image, images, category, countInStock, weight } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        if (images) product.images = images;
        product.category = category;
        product.weight = weight;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req: any, res: Response) => { // Changed AuthenticatedRequest to any for consistency with createProduct
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r: any) => r.user.toString() === req.user?._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400).json({ message: 'Product already reviewed' });
            return;
        }

        const review = {
            name: req.user?.name,
            rating: Number(rating),
            comment,
            user: req.user?._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req: Request, res: Response) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.json(products);
};

// @desc    Delete review
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private/Admin
const deleteProductReview = async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.productId);

    if (product) {
        const reviewIndex = product.reviews.findIndex(
            (r: any) => r._id.toString() === req.params.reviewId
        );

        if (reviewIndex === -1) {
            res.status(404);
            throw new Error('Review not found');
        }

        product.reviews.splice(reviewIndex, 1);

        product.numReviews = product.reviews.length;

        if (product.reviews.length > 0) {
            product.rating =
                product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
                product.reviews.length;
        } else {
            product.rating = 0;
        }

        await product.save();
        res.json({ message: 'Review deleted' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts,
    deleteProductReview,
};
