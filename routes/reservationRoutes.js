import express from 'express';
import {
    getReservations,
    getReservationById,
    createReservation,
    deleteReservation,
    deleteAllReservations,
    updateReservation,
    updateReservationStatus,
} from '../controllers/reservationController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();


// Create a new reservation
router.post('/', createReservation);

// Get all reservations
router.get('/', protect, getReservations);

// Get a reservation by ID
router.get('/:id', protect, getReservationById);

// Delete a reservation by ID
router.delete('/:id', protect, deleteReservation);

// Delete all reservations
router.delete('/', protect, deleteAllReservations);

// Update a reservation by ID
router.patch('/:id', protect, updateReservation);

// Confirm reservation status by ID
router.post('/update-status/:id', protect, updateReservationStatus);

export default router;
