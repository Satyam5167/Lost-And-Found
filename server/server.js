// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import userMailRoutes from "./routes/userMailRoutes.js";

dotenv.config();

const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:5173', 
  'https://track-it-back.netlify.app' //EPLOYED FRONTEND URL
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

const app = express();

// Middleware
app.use(cors({
  origin: '*'
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);          // Auth: register, login, OTP
app.use("/api/users", userRoutes);         // User: profile/details
app.use("/api/items", itemRoutes);         // Items: CRUD operations
app.use("/api/mail", userMailRoutes);      // Mail: send claim notifications

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
