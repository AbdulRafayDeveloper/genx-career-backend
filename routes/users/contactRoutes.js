import express from "express";
import { createNewContact, getOneContact, getAllContacts, deleteOneContact,exportContactsToExcel } from "../../controllers/users/contactController.js";
import { authenticateLoginToken } from "../../middleware/userAuthorization.js";
import newContactValidation from "../../middleware/newContactValidation.js";

const router = express.Router();

router.post("/contactus", newContactValidation, createNewContact);
router.get("/contactus/:id", authenticateLoginToken, getOneContact);
router.get("/contactus/export", authenticateLoginToken, exportContactsToExcel);
router.get("/contactus", authenticateLoginToken, getAllContacts);
router.delete("/contactus/:id", authenticateLoginToken, deleteOneContact);

export default router;
