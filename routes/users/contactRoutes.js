import express from "express";
import { createNewContact, getOneContact, getAllContacts, deleteOneContact,exportContactsToExcel } from "../../controllers/users/contactController.js";
import { authenticateLoginToken } from "../../middleware/userAuthorization.js";
import newContactValidation from "../../middleware/newContactValidation.js";

const router = express.Router();

router.post("/contact-us", newContactValidation, createNewContact);
router.get("/contact-us/:id", authenticateLoginToken, getOneContact);
router.get("/contact-us-list/export", authenticateLoginToken, exportContactsToExcel);
router.get("/contact-us", authenticateLoginToken, getAllContacts);
router.delete("/contact-us/:id", authenticateLoginToken, deleteOneContact);

export default router;
