// server/queries/authQueries.js
import pool from "../db.js";

// 🔹 Find user by email
export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

// 🔹 Create new user
export const createUser = async (email, hashedPassword, phone, name) => {
  const result = await pool.query(
    "INSERT INTO users (email, password, phone, name) VALUES ($1, $2, $3, $4) RETURNING id",
    [email, hashedPassword, phone, name]
  );
  return result.rows[0];
};
