// server/queries/userQueries.js
import pool from "../db.js";

// 🔹 Get user by ID
export const getUserById = async (userId) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
  return result.rows[0];
};
