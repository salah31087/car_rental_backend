import Reservation from "../models/Reservation.js";
import reservationValidationSchema, { reservationUpdateValidationSchema } from "../validators/reservationValidator.js";
import Car from "../models/Car.js";
import * as yup from "yup";




export const getReservations = async (req, res) => {
  try {
    // Récupérer les informations des réservations, des voitures et des contacts
    const [cars, reservations] = await Promise.all([
      Car.find(),
      Reservation.find(),
    ]);

    const totalCars = cars.length;
    // Initialisation des compteurs
    let pendingReservations = 0;
    let confirmedReservations = 0;
    let totalRevenue = 0;

    // Parcourir les réservations pour calculer les informations supplémentaires
    reservations.forEach((reservation) => {
      if (reservation.status === "pending") {
        pendingReservations++;
      } else if (reservation.status === "confirmed") {
        confirmedReservations++;
        totalRevenue += reservation.totalPricePerHour;
      }
    });

    // Retourner les réservations ainsi que les informations supplémentaires
    res.json({
      reservations,
      // Liste complète des réservations

      stats: [
        {
          title: "Revenue",
          icon: "coin",
          value: totalRevenue,
          description: "Total revenue from confirmed reservations",
        },
        {
          title: "cars",
          icon: "car",
          value: totalCars,
          description: "Total cars",
        },
        {
          title: "confirmed reservations",
          icon: "receipt",
          value: confirmedReservations,
          description: "Total confirmed reservations",
        },
        {
          title: "pending reservations",
          icon: "pending",
          value: pendingReservations,
          description: "Total pending reservations",
        },

      ],


    });
  } catch (error) {
    // Gérer les erreurs
    res.status(500).json({ message: "Error fetching reservations.", error });
  }
};

// Get reservation by ID
export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate(
      "carId"
    );
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    const timeDiff = Math.abs(
      new Date(reservation.endDate) - new Date(reservation.startDate)
    );
    const dayCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const totalPrice = dayCount * reservation.carId.pricePerDay;

    res.json({
      ...reservation.toObject(),
      totalPrice,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservation.", error });
  }
};

// Create new reservation
export const createReservation = async (req, res) => {
  try {
    // Validate request body using the reservationValidationSchema
    await reservationValidationSchema.validate(req.body, { abortEarly: false });

    const { carId, name, location, number, startDate, endDate } = req.body;

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ message: "Car not found." });
    }
    // ! updated
    // if (!car.availability) {
    //   return res.status(400).json({ message: "Car is not available." });
    // }
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
      totalPricePerHour,
    });

    await newReservation.save();
    // ! updated
    // const updateavalableCar = await Car.findByIdAndUpdate(
    //   carId,
    //   { availability: false },
    //   { new: true }
    // );
    res.status(201).json({
      message: "Reservation created successfully.",
      reservation: {
        ...newReservation.toObject(),
        pricePerDay: car.pricePerDay,
        totalPricePerHour,
        totalPrice,
      },
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: error.errors.join(", ") });
    }
    res.status(500).json({ message: "Error creating reservation.", error });
  }
};

// Delete reservation by ID
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReservation = await Reservation.findByIdAndDelete(id);

    if (!deletedReservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    res.status(200).json({
      message: "Reservation deleted successfully.",
      reservation: deletedReservation,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reservation.", error });
  }
};

// Delete all reservations
export const deleteAllReservations = async (req, res) => {
  try {
    const deletedReservations = await Reservation.deleteMany();
    res.status(200).json({
      message: "All reservations deleted successfully.",
      reservations: deletedReservations,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reservations.", error });
  }
};

// Update reservation
export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body using the reservationUpdateValidationSchema
    await reservationUpdateValidationSchema.validate(req.body, {
      abortEarly: false,
    });

    const {
      name,
      location,
      number,
      startDate,
      endDate,
      totalPricePerHour,
    } = req.body;

    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { name, location, number, startDate, endDate, totalPricePerHour },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    res.status(200).json({
      message: "Reservation updated successfully.",
      reservation: updatedReservation,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: error.errors.join(", ") });
    }
    res.status(500).json({ message: "Error updating reservation.", error });
  }
};

export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate only the 'status' field using the reservationValidationSchema
    try {
      const trimmedStatus = status?.trim(); // Trim the status value
      await reservationValidationSchema.validateAt("status", {
        status: trimmedStatus,
      });
    } catch (validationError) {
      return res
        .status(400)
        .json({ message: validationError.errors.join(", ") });
    }

    // Proceed with updating the reservation status if validation passes
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { status: status?.trim() }, // Ensure the trimmed status is saved
      { new: true } // Return the updated document
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    res.status(200).json({
      message: "Reservation status updated successfully.",
      reservation: updatedReservation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating reservation status.", error });
  }
};
