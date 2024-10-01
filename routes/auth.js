import User from '../models/User.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import { changePassword } from '../controllers/authController.js';
import protect from '../middlewares/auth.js';
import dotenv from 'dotenv';

dotenv.config();


const router = express.Router();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET

const JWT_EXPIRE = process.env.JWT_EXPIRE

//! @route POST /auth/signup
// @desc Register a new user
router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            name,
            email,
            password, // password will be hashed via the 'pre' hook in the model
            role
        });

        await user.save();

        // Create token
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRE
        });

        res.status(201).json({
            message: 'User registered successfully',
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



//! @route POST /auth/login
// @desc Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Match password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRE
        });

        res.status(200).json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


//! @route POST /auth/change-password
// @desc Change user password
router.patch('/change-password', protect, changePassword);


export default router;


