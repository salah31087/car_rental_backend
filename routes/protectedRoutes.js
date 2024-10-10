import { Router } from "express";
import protect from "../middlewares/auth.js";

const protectedRoutes = Router();


protectedRoutes.get('/check-auth', protect, (req, res) => {
    res.send('You are logged in!');
});


export default protectedRoutes