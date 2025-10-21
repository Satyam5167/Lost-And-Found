// server/routes/userMailRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendClaimMail } from "../controllers/mailController.js";
import sendOtpEmail from "../utils/sendOtp.js";

const router = express.Router();

router.post("/sendClaimMail", authMiddleware, sendClaimMail);

export default router;
