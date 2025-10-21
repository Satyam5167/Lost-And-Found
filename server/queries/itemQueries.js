// server/queries/itemQueries.js
import pool from '../db.js';

export const queryAllItems = async () => {
  const items = await pool.query('SELECT * FROM items ');
  return items.rows;
};

export const queryItemById = async (id) => {
  const item = await pool.query(`SELECT * FROM items WHERE id = $1`, [id]);
  return item.rows[0];
};

export const insertItem = async (item) => {
  const {
    title,
    description,
    location,
    status,
    date_reported,
    imageUrl,
    userId,
  } = item;
  const newItem = await pool.query(
    `INSERT INTO items(title, description, location, status, date_reported, url, user_id) 
     VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [title, description, location, status, date_reported, imageUrl, userId]
  );
  return newItem.rows[0];
};

export const updateItemById = async (id, item, userId) => {
  const { title, description, location, status, date_reported } = item;
  
  const result = await pool.query(
    `UPDATE items SET
       title = $1, 
       description = $2, 
       location = $3,
       status = $4, 
       date_reported = $5 
     WHERE id = $6 AND user_id = $7`, 
    [title, description, location, status, date_reported, id, userId]
  );
  
  return result; 
};
export const deleteItemById = async (id) => {
  const result = await pool.query(`DELETE FROM items WHERE id = $1`, [id]);
  return result;
};

export const queryUserItems = async (userId) => {
  const result = await pool.query(
    `SELECT 
       items.id AS item_id,
       items.title,
       items.url
     FROM items
     WHERE items.user_id = $1`,
    [userId]
  );
  return result.rows;
};

export const deleteUserItemById = async (itemId, userId) => {
  const result = await pool.query(
    `DELETE FROM items
     WHERE id = $1 AND user_id = $2`,
    [itemId, userId]
  );
  return result;
};