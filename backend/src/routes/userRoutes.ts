import express from 'express';
import { authUser, registerUser, getUsers, getUserProfile, updateUserProfile, googleLogin, verifyEmail, forgotPassword, resetPassword } from '../controllers/userController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();
console.log('User Routes Loaded');

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.post('/google-login', googleLogin);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

export default router;
