// server/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendOtpEmail from "../utils/sendOtp.js";
import * as authQueries from "../queries/authQueries.js";

dotenv.config();

const otpStore = new Map(); // stays in-memory
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// 🔹 Send OTP
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(email, { otp, expiresAt });

  try {
    await sendOtpEmail(email, otp);
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// 🔹 Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);

  if (!record || record.otp != otp || Date.now() > record.expiresAt) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  otpStore.set(email, { ...record, verified: true });
  res.json({ message: "OTP verified" });
};

// 🔹 Register User
export const register = async (req, res) => {
  const { email, password, phone, name } = req.body;

  if (!email || !password || !phone || !name) {
    return res.status(400).json({ message: "email or password can not be empty" });
  }

  const otpRecord = otpStore.get(email);
  if (!otpRecord || !otpRecord.verified) {
    return res.status(400).json({ error: "Please verify your email via OTP first" });
  }

  try {
    const existingUser = await authQueries.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = await authQueries.createUser(email, hashedPassword, phone, name);

    otpStore.delete(email);

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token });
  } catch (error) {
    console.error("Registration Failed:", error.message);
    res.status(503).json({ error: "User Registration Failed" });
  }
};

// 🔹 Login User
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email or password can not be empty" });
  }

  try {
    const user = await authQueries.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidUser = await bcrypt.compare(password, user.password);
    if (!isValidUser) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token });
  } catch (error) {
    console.error("Login failed:", error.message);
    res.status(500).json({ error: "Login failed due to server error" });
  }
};
