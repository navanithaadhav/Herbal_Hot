import express from 'express';
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    updateOrderToShipped,
    getMyOrders,
    getOrders,
    getDashboardStats,
    getSalesAnalytics,
    getTopProductsAnalytics,
} from '../controllers/orderController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.get('/stats', protect, admin, getDashboardStats);
router.get('/analytics/sales', protect, admin, getSalesAnalytics);
router.get('/analytics/products', protect, admin, getTopProductsAnalytics);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/ship').put(protect, admin, updateOrderToShipped);

export default router;
