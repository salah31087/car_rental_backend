import Reservation from '../models/Reservation.js';
import reservationValidationSchema from '../validators/reservationValidator.js';
import Car from '../models/Car.js';
import { handleErrorResponse } from '../utils/errorHandler.js';
import * as yup from 'yup';
// Get all reservations
export const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reservations.', error });
    }
};

// Get reservation by ID
export const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate('carId');
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }

        const timeDiff = Math.abs(new Date(reservation.endDate) - new Date(reservation.startDate));
        const dayCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const totalPrice = dayCount * reservation.carId.pricePerDay;

        res.json({
            ...reservation.toObject(),
            totalPrice
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reservation.', error });
    }
};

// Create new reservation
export const createReservation = async (req, res) => {
    try {
        await reservationValidationSchema.validate(req.body);

        const { carId, name, location, number, startDate, endDate } = req.body;

        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found.' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = Math.abs(end - start);
        const dayCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const hourCount = Math.ceil(timeDiff / (1000 * 60 * 60));

        const pricePerHour = car.pricePerDay / 24;
        const totalPricePerHour = hourCount * pricePerHour;
        const totalPrice = dayCount * car.pricePerDay;

        const newReservation = new Reservation({
            carId,
            name,
            location,
            number,
            startDate,
            endDate,
            totalPrice,
            totalPricePerHour
        });

        await newReservation.save();

        res.status(201).json({
            message: 'Reservation created successfully.',
            reservation: {
                ...newReservation.toObject(),
                pricePerDay: car.pricePerDay,
                totalPricePerHour,
                totalPrice
            }
        });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error creating reservation.', error });
    }
};

// Delete reservation by ID
export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReservation = await Reservation.findByIdAndDelete(id);

        if (!deletedReservation) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }

        res.status(200).json({
            message: 'Reservation deleted successfully.',
            reservation: deletedReservation
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting reservation.', error });
    }
};

// Delete all reservations
export const deleteAllReservations = async (req, res) => {
    try {
        const deletedReservations = await Reservation.deleteMany();
        res.status(200).json({
            message: 'All reservations deleted successfully.',
            reservations: deletedReservations
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting reservations.', error });
    }
};

// Update reservation by ID
export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { carId, name, location, number, startDate, endDate, totalPricePerHour } = req.body;
        const updatedReservation = await Reservation.findByIdAndUpdate(id, { carId, name, location, number, startDate, endDate, totalPricePerHour }, { new: true });
        if (!updatedReservation) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }

        res.status(200).json({
            message: 'Reservation updated successfully.',
            reservation: updatedReservation
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating reservation.', error });
    }
}

// Update reservation status by ID
export const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedReservation = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedReservation) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }

        res.status(200).json({
            message: 'Reservation status updated successfully.',
            reservation: updatedReservation
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating reservation status.', error });
    }
}
