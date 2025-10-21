// server/routes/itemRoutes.js
import express from 'express';
import dotenv from 'dotenv';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  getUserItems,
  deleteUserItem,
} from '../controllers/itemController.js';


dotenv.config();
const router = express.Router();

// --- Cloudinary & Multer Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'items',
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
});

const parser = multer({ storage });
//get all items
router.get('/', authMiddleware, getAllItems);

//add a new item
router.post('/', authMiddleware, parser.single('image'), addItem);

// Get items for the logged-in user
router.get('/getUserItems', authMiddleware, getUserItems);

//Delete an item owned by the logged-in user
router.delete('/deleteUserItem', authMiddleware, deleteUserItem);

// Get a single item by ID
router.get('/:id', authMiddleware, getItemById);

//Update an item by ID
router.put('/:id', authMiddleware, updateItem);

// Delete an item by ID -admin only
router.delete('/:id', authMiddleware, deleteItem);

export default router;