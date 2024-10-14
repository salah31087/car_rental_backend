import User from '../models/User.js';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();
const maxAge = 24 * 60 * 60; // 1 day in seconds


function generateToken(user) {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: maxAge });
}

export const checkAuth = async (req, res) => {
    try {
        // Get token from cookies
        const token = req.cookies.token;

        // If no token is found, return unauthorized status
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }

            // Check if the user exists based on decoded user ID
            const user = await User.findById(decodedToken.userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // If everything is valid, return authenticated user data
            return res.status(200).json({
                message: 'Authenticated',
                user: { id: user._id, email: user.email }
            });
        });
    } catch (error) {
        console.error('Authentication check error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const signup = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' }); // Conflict error
        }

        // Create a new user
        const user = await User.create({ email, password });

        // Generate JWT token
        const token = generateToken(user);

        // Set token in a secure HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
            secure: process.env.NODE_ENV === 'production' // Only secure in production
        });

        res.status(201).json({ message: 'User created successfully', user: user._id });
    }
    catch (error) {
        // Check for specific MongoDB errors (e.g., validation errors)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ details: error.message });
        }

        // Handle duplicate key error (if unique constraint is violated)
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already exists', code: error.code });
        }

        // Log the error for debugging (optional)
        console.error('Signup error:', error);

        // General server error
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });

        // If no user is found, return an error (but do not specify whether the email or password is wrong)
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored password
        const isMatch = await bcrypt.compare(password, user.password);

        // If the password does not match, return an error
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Set the token in an HTTP-only cookie (secure should be true in production)
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // Adjust maxAge as per your requirement
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict',
        });


        // Send token and success response
        res.status(200).json({ token, user: email });
    } catch (error) {
        // Catch any server-side error and send a 500 response
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}

