// server/routes/authRoutes.js
import express from "express";
import {
  sendOtp,
  verifyOtp,
  register,
  login,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", register);
router.post("/login", login);

export default router;