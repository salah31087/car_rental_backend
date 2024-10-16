import express from "express";
import {
  getContacts,
  createContact,
  deleteContacts,
  deleteContact,
} from "../controllers/contactController.js";
import protect from "../middlewares/auth.js";

const router = express.Router();

// Create a new contact
router.post("/", createContact);

// Get all contacts (protected)
router.get("/", protect, getContacts);

// Delete all contacts
router.delete("/", protect, deleteContacts);

// Delete contact by ID
router.delete("/:id", protect, deleteContact);

export default router;
