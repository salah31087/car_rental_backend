import mongoose from 'mongoose';

const { Schema } = mongoose;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: /.+\@.+\..+/ }, // Simple email validation
  phoneNumber: { 
    type: String, 
    required: true, 
    match: /^\+?[1-9]\d{1,14}$/ // Optional: Regex for international phone number validation
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create the Contact model
const Contact = mongoose.model('Contact', contactSchema);

export default Contact;




// {
//   "name": "Jane Smith",
//   "email": "janesmith@example.com",
//   "phoneNumber": "+19876543210",
//   "message": "I am interested in booking a car for my upcoming trip. Can you provide me with the available options?"
// }