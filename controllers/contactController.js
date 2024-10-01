import Contact from '../models/Contact.js';
import contactValidationSchema from '../validators/contactValidation.js';
import { handleErrorResponse } from '../utils/errorHandler.js';

// Get all contacts
export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts.', error });
    }
};

// Create a new contact
export const createContact = async (req, res) => {
    try {
        await contactValidationSchema.validate(req.body);
        const { name, email, phoneNumber, message } = req.body;
        const newContact = new Contact({ name, email, phoneNumber, message });
        await newContact.save();
        res.status(201).json({ message: 'Contact request submitted successfully.' });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error submitting contact request.', error });
    }
};

// Delete all contacts
export const deleteContacts = async (req, res) => {
    try {
        const result = await Contact.deleteMany({});
        res.status(200).json({ message: 'All contacts deleted successfully.', deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contacts.', error });
    }
};
