import mongoose from 'mongoose';

const { Schema } = mongoose;

const reservationSchema = new Schema({
    carId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Car' // Assuming you have a Car model
    },
    name: String,
    location: {
        type: String,
        transform: (value) => value.toLowerCase()
    },
    number: String,
    startDate: Date,
    endDate: Date,
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
    totalPrice:
        Number,
    totalPricePerHour:
        Number

});

// Create the Reservation model
const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;



