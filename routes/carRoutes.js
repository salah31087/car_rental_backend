import express from 'express';
import { createCar, getCars, getCarById, updateCar, deleteCar, deleteAllCars } from '../controllers/carController.js';
import protect from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';



const router = express.Router();


const uploadImages = upload.fields([
    { name: 'carMainImage', maxCount: 1 },   // Single main image
    { name: 'carGallery', maxCount: 5 },     // Up to 5 gallery images
])


router.post('/', protect, uploadImages, createCar);
router.get('/', getCars);
router.get('/:id', getCarById);
router.put('/:id', uploadImages, protect, updateCar);
router.delete('/:id', protect, deleteCar);
router.delete('/', deleteAllCars);

export default router;

