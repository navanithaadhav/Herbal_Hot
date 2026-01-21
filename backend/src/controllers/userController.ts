import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import sendEmail from '../utils/emailService';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface AuthenticatedRequest extends Request {
    user?: any;
}

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            addresses: user.addresses,
            token: generateToken(user._id.toString()),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
        name,
        email,
        password,
        verificationToken: otp,
        verificationTokenExpire: otpExpire
    });

    if (user) {
        // Send OTP Email
        const message = `Your email verification code is: ${otp}. This code expires in 10 minutes.`;

        console.log(`DEV MODE (Register) - OTP: ${otp}`); // For debugging

        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification OTP',
                message,
                html: `<p>Your email verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                message: 'Registration successful! Please check your email for the OTP.',
                isVerified: false
            });
        } catch (error) {
            console.error(error);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                message: 'Registration successful but email failed to send. Please contact support.',
                isVerified: false
            });
        }
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Verify user email
// @route   POST /api/users/verify-email
// @access  Public
const verifyEmail = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        res.status(400).json({ message: 'Email and OTP are required' });
        return;
    }

    const user = await User.findOne({
        email,
        verificationToken: otp,
        verificationTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400).json({ message: 'Invalid or expired OTP' });
        return;
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Clear token
    user.verificationTokenExpire = undefined;
    await user.save();

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()), // Issue auth token now
        message: 'Email verified successfully'
    });
};

// @desc    Forgot Password (OTP)
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordToken = otp;
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    const message = `Your password reset code is: ${otp}. This code expires in 10 minutes.`;

    console.log(`DEV MODE (Forgot Password) - OTP: ${otp}`); // For debugging

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset OTP',
            message,
            html: `<p>Your password reset code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
        });

        res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(500).json({ message: 'Email could not be sent' });
    }
};

// @desc    Reset Password with OTP
// @route   PUT /api/users/reset-password
// @access  Public
const resetPassword = async (req: Request, res: Response) => {
    let { email, otp, password } = req.body;

    // Safety: trim whitespace
    if (email) email = email.trim();
    if (otp) otp = otp.trim();

    const user = await User.findOne({
        email,
        resetPasswordToken: otp,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400).json({ message: 'Invalid OTP or email' });
        return;
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({ message: 'Password updated success' });
};

const getUsers = async (req: Request, res: Response) => {
    console.log('getUsers called');
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    res.json(users);
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        if (req.body.password) {
            user.password = req.body.password;
        }
        if (req.body.addresses) {
            user.addresses = req.body.addresses;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            addresses: updatedUser.addresses,
            token: generateToken(updatedUser._id.toString()),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Auth user via Google
// @route   POST /api/users/google-login
// @access  Public
const googleLogin = async (req: Request, res: Response) => {
    console.log('googleLogin controller called');
    const { token } = req.body;
    console.log('Token received:', token ? 'Token exists' : 'No token');

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (payload) {
            const { name, email } = payload;
            let user = await User.findOne({ email });

            if (user) {
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id.toString()),
                });
            } else {
                const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

                user = await User.create({
                    name,
                    email,
                    password: randomPassword,
                });

                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id.toString()),
                });
            }
        } else {
            res.status(400).json({ message: 'Invalid Google Token' });
        }
    } catch (error) {
        console.error('Google Login Error:', error);
        res.status(400).json({ message: 'Google Login Failed', error });
    }
};

export { authUser, registerUser, getUsers, getUserProfile, updateUserProfile, googleLogin, verifyEmail, forgotPassword, resetPassword };
