import express from "express";
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getOneContactController,
} from "../../controllers/user/contactUs.js";

import { authenticateLoginToken } from "../../middleware/userAuthorization.js";

const router = express.Router();

router.post("/contactus", createContactController);
router.delete("/contactus/:id",authenticateLoginToken,deleteContactController);
router.get("/contactus/:id", authenticateLoginToken, getOneContactController);
router.get("/contactus", authenticateLoginToken, getAllContactsController);

export default router;
