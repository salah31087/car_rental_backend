import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';  // Make sure the path to your User model is correct
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
    try {
        // Connect to your database
        await mongoose.connect(process.env.MONGODB_URI);


        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit(0);
        }

        // Hash the password
        const password = 'salahbel';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin user
        const adminUser = new User({
            name: 'admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            role: 'admin',
            createdAt: new Date(),
        });

        await adminUser.save();
        console.log('Main admin created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
