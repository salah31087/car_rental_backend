import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User schema
// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'Please add a name'],
//         trim: true,
//         maxlength: [50, 'Name cannot be more than 50 characters'],
//     },
//     email: {
//         type: String,
//         required: [true, 'Please add an email'],
//         unique: true,
//         match: [
//             /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//             'Please add a valid email',
//         ],
//     },
//     password: {
//         type: String,
//         required: [true, 'Please add a password'],
//         minlength: 6,
//         select: false, // Do not return the password field by default
//     },
//     role: {
//         type: String,
//         enum: ['user', 'admin'],
//         default: 'user',
//     },

//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
    }
});


// fire function before doc saved to db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};


// Export the User model
const User = mongoose.model('User', userSchema);

export default User;
