import { Router } from "express";
import { login, logout, signup } from '../controllers/authController.js'
import protect from "../middlewares/auth.js";



const authRoutes = Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login)
authRoutes.post('/logout', protect, logout)



export default authRoutes