import express from "express";
import { generateCV } from "../../controllers/cvCreation/cvController.js";

const router = express.Router();

router.post("/generate", generateCV);

export default router;
