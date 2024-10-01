import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log('Connection error:', error));
export default mongoose;

