import express from "express";
import { createNewContact, getOneContact, getAllContacts, deleteOneContact, exportContactsToExcel } from "../../controllers/users/contactController.js";
import { verifyAdminToken } from "../../middleware/auth/authorizeUser.js";
import validateContactForm from "../../middleware/contact/validateContactForm.js";

const router = express.Router();

router.post("/contact-us", validateContactForm, createNewContact);
router.get("/contact-us/:id", verifyAdminToken, getOneContact);
router.get("/contact-us-list/export", verifyAdminToken, exportContactsToExcel);
router.get("/contact-us", verifyAdminToken, getAllContacts);
router.delete("/contact-us/:id", verifyAdminToken, deleteOneContact);

export default router;
