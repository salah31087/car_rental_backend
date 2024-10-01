import Car from '../models/Car.js';
import carSchema from '../validators/carValidator.js';
import updateCarSchema from '../validators/updateCarValidator.js';
import { handleErrorResponse } from '../utils/errorHandler.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Simuler __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// import path from 'path';

// Create a new car
export const createCar = async (req, res) => {
    try {
        const {
            model,
            type,
            pricePerDay,
            location,
            gearBox,
            maximumSpeed,
            fuelType,
            manufacturedYear,
            maxPassengers,
            mileage,
            airCondition,
            description,
            availability
        } = req.body;

        // Check if images are uploaded
        if (!req.files || !req.files['carMainImage'] || !req.files['carGallery']) {
            return res.status(400).json({ success: false, message: 'Please upload both main image and gallery images' });
        }

        // Extract the file paths and add `/uploads/` prefix
        const carMainImage = `/uploads/${req.files['carMainImage'][0].filename}`; // Store the main image path
        const carGallery = req.files['carGallery'].map(file => `/uploads/${file.filename}`); // Store the gallery images' paths

        // Create the car object with the images' paths
        const newCar = new Car({
            model,
            type,
            pricePerDay,
            location,
            gearBox,
            maximumSpeed,
            fuelType,
            manufacturedYear,
            maxPassengers,
            mileage,
            airCondition,
            description,
            carMainImage,    // Save the main image path
            carGallery,      // Save the gallery images paths
            availability
        });

        // Save the new car in the database
        await newCar.save();
        res.status(201).json({ success: true, message: 'Car added successfully', car: newCar });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.errors });
        }
        handleErrorResponse(res, error); // Error handler middleware
    }
};

// Get all cars
export const getCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.json({ success: true, cars });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Get car by ID
export const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findById(id);
        if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
        res.json({ success: true, car });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Update car
export const updateCar = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the car by ID
        const car = await Car.findById(id);
        const carimg = car.carMainImage;
        const cargl = car.carGallery;


        if (!car) return res.status(404).json({ success: false, message: 'Car not found' });

        // Extract fields from req.body (if any fields are updated)
        const {
            model,
            type,
            pricePerDay,
            location,
            gearBox,
            maximumSpeed,
            fuelType,
            manufacturedYear,
            maxPassengers,
            mileage,
            airCondition,
            description,
            availability,
        } = req.body;

        // Check if new main image is uploaded, otherwise keep the existing one
        let carMainImage = car.carMainImage;
        if (req.files && req.files['carMainImage']) {
            carMainImage = `/uploads/${req.files['carMainImage'][0].filename}`; // New main image path
        }

        if (carimg && carimg !== carMainImage) {
            const carimgPath = path.join(__dirname, '..', carimg);
            fs.unlink(carimgPath, (err) => {
                if (err) console.error(`Error while deleting old main image: ${err}`);
            });
        }

        // Check if new gallery images are uploaded, otherwise keep the existing ones
        let carGallery = car.carGallery;
        if (req.files && req.files['carGallery']) {
            carGallery = req.files['carGallery'].map(file => `/uploads/${file.filename}`); // New gallery images paths
        }

        cargl.forEach(oldImage => {
            if (!carGallery.includes(oldImage)) {
                const oldGalleryImagePath = path.join(__dirname, '..', oldImage);
                fs.unlink(oldGalleryImagePath, (err) => {
                    if (err) console.error(`Error while deleting old gallery images: ${err}`);
                });
            }
        });

        // Update the car object
        car.model = model || car.model;
        car.type = type || car.type;
        car.pricePerDay = pricePerDay || car.pricePerDay;
        car.location = location || car.location;
        car.gearBox = gearBox || car.gearBox;
        car.maximumSpeed = maximumSpeed || car.maximumSpeed;
        car.fuelType = fuelType || car.fuelType;
        car.manufacturedYear = manufacturedYear || car.manufacturedYear;
        car.maxPassengers = maxPassengers || car.maxPassengers;
        car.mileage = mileage || car.mileage;
        car.airCondition = airCondition || car.airCondition;
        car.description = description || car.description;
        car.carMainImage = carMainImage;
        car.carGallery = carGallery;
        car.availability = availability !== undefined ? availability : car.availability;

        // Save the updated car to the database
        await car.save();

        res.json({ success: true, message: 'Car updated successfully', car });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.errors });
        }
        handleErrorResponse(res, error); // Error handler middleware
    }
};


// Delete car
export const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findByIdAndDelete(id);
        if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
        res.json({ success: true, message: 'Car deleted successfully' });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};


// ! Delete all cars
export const deleteAllCars = async (req, res) => {
    try {
        await Car.deleteMany();
        res.json({ success: true, message: 'All cars deleted successfully' });
    } catch (error) {
        handleErrorResponse(res, error);
    }
}