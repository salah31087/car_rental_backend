import Contact from "../models/Contact.js";
import contactValidationSchema from "../validators/contactValidation.js";
import * as yup from "yup";

// Get all contacts
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts.", error });
  }
};

// Create a new contact
export const createContact = async (req, res) => {
  try {
    // Validate the contact information using the contactValidationSchema
    await contactValidationSchema.validate(req.body);

    const { name, email, phoneNumber, message } = req.body;

    const newContact = new Contact({ name, email, phoneNumber, message });
    await newContact.save();

    res
      .status(201)
      .json({ message: "Contact request submitted successfully." });
  } catch (error) {
    // Handle validation errors
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Error submitting contact request.", error });
  }
};

// Delete all contacts
export const deleteContacts = async (req, res) => {
  try {
    const result = await Contact.deleteMany({});
    res.status(200).json({
      message: "All contacts deleted successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting contacts.", error });
  }
};

// Delete contact by ID
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Contact not found." });
    }
    res.status(200).json({
      message: "Contact deleted successfully.",
      deletedContact: result,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting contact.", error });
  }
};
