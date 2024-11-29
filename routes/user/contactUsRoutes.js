import express from "express";
import {
  createNewContact,
  getOneContact,
  getAllContacts,
  deleteOneContact
} from "../../controllers/user/contactUsController.js";

import { authenticateLoginToken } from "../../middleware/userAuthorization.js";

const router = express.Router();

router.post("/contactus", createNewContact);
router.get("/contactus/:id", authenticateLoginToken, getOneContact);
router.get("/contactus", authenticateLoginToken, getAllContacts);
router.delete("/contactus/:id", authenticateLoginToken, deleteOneContact);

export default router;
