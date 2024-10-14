import mongoose from "mongoose";

const { Schema } = mongoose;

const contactSchema = new Schema({
  name: String,
  email: String,
  phoneNumber: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

// Create the Contact model
const Contact = mongoose.model("Contact", contactSchema);

export default Contact;


