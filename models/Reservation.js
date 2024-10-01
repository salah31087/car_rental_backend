import mongoose from 'mongoose';

const { Schema } = mongoose;

const reservationSchema = new Schema({
    carId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Car' // Assuming you have a Car model
    },
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    totalPrice: {
        type: Number
    },
    totalPricePerHour: {
        type: Number
    }
});

// Create the Reservation model
const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;


