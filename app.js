import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import carRoutes from './routes/carRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import mongoose from './configs/db.js';

dotenv.config();

// connect to mongo
mongoose;


const app = express();
// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your React app URL
    credentials: true, // Allow credentials (cookies, headers)
}));
app.use('/uploads', express.static('uploads'));
app.use(express.json());


const PORT = process.env.PORT || 3000;



// Routes
app.use('/auth', authRoutes);
app.use('/cars', carRoutes);
app.use('/contacts', contactRoutes);
app.use('/reservations', reservationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

