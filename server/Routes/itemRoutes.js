import express from 'express';
import dotenv from 'dotenv';
import pool from '../db.js';
import authMiddleware from '../Middleware/xyz.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
dotenv.config();

const router = express.Router();

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

// Fetch all items

router.get('/items',authMiddleware, async(req, res)=>{
    try {
        const items = await pool.query("SELECT * FROM items");
        res.json(items.rows);;
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Can't fetch items"});
    }
});

//get an single item

router.get('/items/:id',authMiddleware, async(req, res)=>{
    const { id } = req.params;
    try {
        const item = await pool.query(`SELECT * FROM items WHERE id = $1`, [id]);
        res.json(item.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
});

//add an item

router.post('/items',authMiddleware,parser.single('image'), async(req, res)=>{
    const { title, description, location, status, date_reported } = req.body;
    const imageUrl = req.file.path; // Cloudinary URL
    try {
        const addItem = await pool.query(`INSERT INTO items(title, description, 
                                          location, status, date_reported, url, user_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`, 
                                          [title, description, location, status, date_reported, imageUrl, req.userId]);
        res.json(addItem.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Failed to add item"});
    }
});

//update an item

router.put('/items/:id',authMiddleware, async(req,res)=>{
    const { title, description, status } = req.body;
    const { id } = req.params;

    try {
        const updateItem = await pool.query(`UPDATE items SET
                                             title = $1, description = $2,
                                             status = $3 WHERE id = $4`, [title, description, status, id]);
        res.json({message: "item updated"});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Can't update item"});
    }
});

router.delete('/items/:id',authMiddleware, async(req, res)=>{
    const { id } = req.params;
    try {
        const deleteItem = await pool.query(`DELETE FROM items WHERE id = $1`, [id]);
        res.json({message:"item deleted"});
    } catch (error) {
        console.log(error.message);
    }
});

export default router;