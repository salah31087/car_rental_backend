import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import carRoutes from "./routes/carRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import mongoose from "./configs/db.js";
import cookieParser from "cookie-parser";
import protectedRoutes from "./routes/protectedRoutes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

// connect to mongo
mongoose;

const app = express();


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again in 15 minutes.",
});


app.use(limiter);

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cookieParser()); // Parse cookies attached to the request

const PORT = process.env.PORT || 3000;

// Routes
app.use(protectedRoutes);
app.use("/auth", authRoutes);
app.use("/cars", carRoutes);
app.use("/contacts", contactRoutes);
app.use("/reservations", reservationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

