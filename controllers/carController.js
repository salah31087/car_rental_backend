import Car from '../models/Car.js';
import { handleErrorResponse } from '../utils/errorHandler.js';
import carSchema from '../validators/carValidator.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Create a new car
export const createCar = async (req, res) => {
  try {
    // Validate request body
    await carSchema.validate(req.body);

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


    // Check if the main image is uploaded
    if (!req.files || !req.files["carMainImage"]) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please upload the main image",
        });
    }

    // Extract the file paths and add `/uploads/` prefix
    const carMainImage = `/uploads/${req.files["carMainImage"][0].filename}`; // Store the main image path

    // Initialize the carGallery variable and conditionally set it
    let carGallery = [];
    if (req.files["carGallery"]) {
      carGallery = req.files["carGallery"].map(
        (file) => `/uploads/${file.filename}`
      );
    }

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
      carMainImage, // Save the main image path
      carGallery: carGallery.length > 0 ? carGallery : undefined, // Only include carGallery if images are provided
      availability,
    });

    // Save the new car in the database
    await newCar.save();
    res
      .status(201)
      .json({ success: true, message: "Car added successfully", car: newCar });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.errors });
    }
    handleErrorResponse(res, error); // Error handler middleware
  }
};


// Update car
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    await carSchema.validate(req.body);

    // Find the car by ID
    const car = await Car.findById(id);
    if (!car)
      return res.status(404).json({ success: false, message: "Car not found" });

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
    if (req.files && req.files["carMainImage"]) {
      carMainImage = `/uploads/${req.files["carMainImage"][0].filename}`; // New main image path
    }

    // Check if new gallery images are uploaded, otherwise keep the existing ones
    let carGallery = car.carGallery;
    if (req.files && req.files["carGallery"]) {
      carGallery = req.files["carGallery"].map(
        (file) => `/uploads/${file.filename}`
      ); // New gallery images paths
    }

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
    car.availability =
      availability !== undefined ? availability : car.availability;

    // Save the updated car to the database
    await car.save();

    res.json({ success: true, message: "Car updated successfully", car });
  } catch (error) {
    if (error.name === "ValidationError") {
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

// Delete all cars
export const deleteAllCars = async (req, res) => {
  try {
    await Car.deleteMany();
    res.json({ success: true, message: 'All cars deleted successfully' });
  } catch (error) {
    handleErrorResponse(res, error);
  }
}