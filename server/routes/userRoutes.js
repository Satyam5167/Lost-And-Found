// server/routes/userRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUserDetails } from "../controllers/userController.js";


const router = express.Router();

router.get("/", authMiddleware, getUserDetails);

export default router;
