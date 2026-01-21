import express from 'express';
import {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    getTopProducts,
    createProductReview,
    deleteProductReview,
} from '../controllers/productController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/top', getTopProducts);
router.route('/:id/reviews').post(protect, createProductReview);
router
    .route('/:id')
    .get(getProductById)
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct);

router.route('/:productId/reviews/:reviewId').delete(protect, admin, deleteProductReview);

export default router;
